using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TripPlannerBackend.API.Dto;
using TripPlannerBackend.API;
using TripPlannerBackend.API.Entity;
using Microsoft.AspNetCore.Authentication;
using System.Diagnostics;

namespace TripPlannerBackend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripController : ControllerBase
    {
        private readonly TripPlannerDbContext _context;
        private readonly IMapper _mapper;
        public TripController(TripPlannerDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //Search - everyone is allowed to search

        //Get By ID
        [HttpGet("{id}")]
        [Authorize]
        //[Authorize(Policy = "TripReadAccess")]
        public async Task<ActionResult<GetTripDto>> GetTrip(int id)
        {
            bool isSharedUser = false;
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            string userEmail = User.FindFirst("https://your-namespace/email")?.Value;

            var trip = await _context.Trips
                .Include(t => t.Activities).ThenInclude(a => a.ActivityType)
                .Include(t => t.Cost)
                .Include(t => t.Users)
                .Include(t => t.Activities) // Include the Activities again
                .ThenInclude(a => a.Cost)
                .SingleAsync(t => t.Id == id);

            if (trip == null)
            {
                return NotFound();
            }

            if (trip.Users != null)
            {
                foreach (var user in trip.Users)
                {
                    if (user.Email == userEmail)
                    {
                        isSharedUser = true;
                    }
                }
            }

            
            if (!isSharedUser && trip.UserId != userId && trip.IsPublic) { trip.Count += 1; } // Random users will add count

            if (isSharedUser || trip.UserId == userId || trip.IsPublic)
            {
                await _context.SaveChangesAsync();
                return _mapper.Map<GetTripDto>(trip);
            } else
            {
                return Unauthorized("You are not allowed to see that trip");
            }
        }

        [HttpGet("activity/{id}")]
        [Authorize]
        //[Authorize(Policy = "TripReadAccess")]
        public async Task<ActionResult<GetActivityDto>> GetActivity(int id)
        {

            var activity = await _context.Activities
                .Include(t => t.ActivityType)
                .Include(t => t.Cost)
                .SingleAsync(a => a.Id == id);

            if (activity == null)
            {
                return NotFound();
            }

            return _mapper.Map<GetActivityDto>(activity);
        }

        // Get ALL SHARED TRIPS
        [HttpGet("shared")]
        [Authorize]
        //[Authorize(Policy = "TripReadAccess")]
        public async Task<ActionResult<List<GetTripDto>>> GetTripsShared()
        {
            string email = User.FindFirst("https://your-namespace/email")?.Value;
            string picture = User.FindFirst("https://your-namespace/picture")?.Value;

            Console.WriteLine($"Email: {email}, Picture: {picture}");

            var trips = await _context.Trips
                .Where(t => t.Users != null && t.Users.Any(u => u.Email == email))
                .Include(t => t.Activities)
                .Include(t => t.Cost)
                .Include(t => t.Users)
                .ToListAsync();

            if (trips == null)
            {
                return NotFound();
            }

            var tripDtos = _mapper.Map<List<GetTripDto>>(trips);

            // Map profile picture URL to the corresponding user's email
            foreach (var tripDto in tripDtos)
            {
                foreach (var userDto in tripDto.Users)
                {
                    if (userDto.Email == email)
                    {
                        // Use the profile picture URL from the ID token
                        userDto.Picture = picture;
                    }
                }
            }

            return tripDtos;
        }


        [HttpGet("/api/public")]
        public async Task<ActionResult<List<GetTripDto>>> GetTripsPublic()
        {
            var trips = await _context.Trips
                .Where(t => t.IsPublic)
                .Include(t => t.Cost)
                .Include(t => t.Activities)
                .Include(t => t.Users)
                .ToListAsync();

            if (trips == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<GetTripDto>>(trips);
        }


        [HttpGet("/api/public/search")]
        public async Task<ActionResult<List<GetTripDto>>> SearchTripsPublic([FromQuery] SearchTripDto searchDto)
        {
            var tripsQuery = _context.Trips
                .Where(t => t.IsPublic)
                .Include(t => t.Activities).AsQueryable();

            if (searchDto.Name != null)
            {
                tripsQuery = tripsQuery.Where(t => t.Name.ToLower().Contains(searchDto.Name.ToLower()) || t.Activities.Any(a => a.Name.ToLower().Contains(searchDto.Name)));
            }

            if (searchDto.Location != null)
            {
                tripsQuery = tripsQuery.Where(t => t.Location.ToLower().Contains(searchDto.Location.ToLower()) || t.Activities.Any(a => a.Location.ToLower().Contains(searchDto.Location)));
            }

            if (searchDto.Type != null)
            {
                tripsQuery = tripsQuery.Where(t => t.Type == searchDto.Type);
            }


            var trips = await tripsQuery.ToListAsync();

            if (trips == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<GetTripDto>>(trips);
        }



        [HttpPatch("leave/{tripId}")]
        [Authorize]
        public async Task<ActionResult> LeaveTrip(int tripId)
        {
            string userEmail = User.FindFirst("https://your-namespace/email")?.Value;

            var trip = await _context.Trips
                .Include(t => t.Users)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
            {
                return NotFound("Trip not found");
            }

            var user = trip.Users.FirstOrDefault(u => u.Email == userEmail);

            if (user == null)
            {
                return NotFound("User not found in the trip");
            }

            trip.Users.Remove(user);

            try
            {
                await _context.SaveChangesAsync();
                return NoContent(); // Successfully left the trip
            }
            catch (Exception ex)
            {
                // Handle exception if needed
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Get ALL YOUR TRIPS
        [HttpGet]
        [Authorize]
        //[Authorize(Policy = "TripReadAccess")]
        public async Task<ActionResult<List<GetTripDto>>> GetTrips()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            var trips = await _context.Trips
                .Where(t => t.UserId == userId)
                .Include(t => t.Activities)
                .Include(t => t.Cost)
                .Include(t => t.Users)
                .ToListAsync();

            if (trips == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<GetTripDto>>(trips);
        }

        //Insert - you have to be authenticated
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<GetTripDto>> AddTrip(CreateTripDto trip)
        {
            Trip tripToAdd = _mapper.Map<Trip>(trip);

            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var userTripCount = await _context.UserTripCount
        .FirstOrDefaultAsync(utc => utc.UserId == userId);

            if (userTripCount == null)
            {
                // If the user doesn't have a trip count entry, create one
                userTripCount = new UserTripCount
                {
                    UserId = userId,
                    TripCount = 1
                };
                _context.UserTripCount.Add(userTripCount);
            }
            else
            {
                // If the user already has a trip count entry, increment the count
                userTripCount.TripCount++;
            }

            await _context.SaveChangesAsync();

            if (trip.Users != null && trip.Users.Any())
            {
                // Filter out users with null or empty email
                tripToAdd.Users = trip.Users
                    .Where(user => !string.IsNullOrWhiteSpace(user.Email))
                    .Select(user => new User { Email = user.Email })
                    .ToList();
            }

            _context.Trips.Add(tripToAdd);
            await _context.SaveChangesAsync();

            GetTripDto tripToReturn = _mapper.Map<GetTripDto>(tripToAdd);

            return CreatedAtAction(nameof(GetTrip), new { id = tripToReturn.Id }, tripToReturn);
        }

              //[HttpPut("invite")]
        //[Authorize]
        //public async Task<ActionResult<GetTripDto>> InviteFriends(int id, EditTripDto dto)
        //{
        //    var trip = await _context.Trips.Include(t => t.Users).SingleAsync(t => t.Id == id);

        //    if (trip == null)
        //    {
        //        return NotFound();
        //    }

        //    if (dto.Users != null && dto.Users.Any())
        //    {
        //        // Filter out users with null or empty email
        //        trip.Users = dto.Users
        //            .Where(user => !string.IsNullOrWhiteSpace(user.Email))
        //            .Select(user => new User { Email = user.Email })
        //            .ToList();
        //    }

        //    _context.Trips.Update(trip);
        //    await _context.SaveChangesAsync();

        //    GetTripDto tripToReturn = _mapper.Map<GetTripDto>(trip);

        //    return CreatedAtAction(nameof(GetTrip), new { id = tripToReturn.Id }, tripToReturn);
        //}


        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<GetTripDto>> EditTrip(int id, EditTripDto tripDto)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            try
            {
                var trip = await _context.Trips.Include(t => t.Activities).Include(t => t.Cost).Include(t => t.Users).SingleAsync(t => t.Id == id);

                if (trip == null)
                {
                    return NotFound();
                }

                if (trip.UserId != userId)
                {
                    return Unauthorized("You are not allowed to edit this trip");
                }

                // Update properties of the existing trip with values from tripDto
                _mapper.Map(tripDto, trip);

                _context.Trips.Update(trip);
                await _context.SaveChangesAsync();

                var updatedTripDto = _mapper.Map<GetTripDto>(trip);
                return Ok(updatedTripDto);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("publish/{id}")]
        [Authorize]
        public async Task<ActionResult> PublishTrip(int id)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            var trip = await _context.Trips.SingleAsync(t => t.Id == id);

            if (trip == null)
            {
                return NotFound();
            }

            if (trip.UserId != userId)
            {
                return Unauthorized();
            }

            trip.IsPublic = true;
            _context.Trips.Update(trip);
            await _context.SaveChangesAsync();

            return Ok(trip);
        }

        [HttpPut("unpublish/{id}")]
        [Authorize]
        public async Task<ActionResult> UnpublishTrip(int id)
        {
            var trip = await _context.Trips.SingleAsync(t => t.Id == id);
            if (trip == null)
            {
                return NotFound();
            }

            trip.IsPublic = false;
            _context.Trips.Update(trip);
            await _context.SaveChangesAsync();

            return Ok(trip);
        }

        [HttpPut("activity/{id}")]
        [Authorize]
        public async Task<ActionResult<GetActivityDto>> EditActivity(int id, EditActivityDto activityDto)
        {
            bool isSharedUser = false;
            string userEmail = User.FindFirst("https://your-namespace/email")?.Value;
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            try
            {
                var activity = await _context.Activities.Include(a => a.ActivityType).Include(a => a.Cost).SingleAsync(a => a.Id == id);

                var trip = await _context.Trips.Include(t => t.Users).SingleAsync(t => t.Id == activity.TripId);

                if (activity == null)
                {
                    return NotFound();
                }

                if (trip.Users != null)
                {
                    foreach (var user in trip.Users)
                    {
                        if (user.Email == userEmail)
                        {
                            isSharedUser = true;
                        }
                    }
                }

                if (isSharedUser || trip.UserId == userId)
                {
                    // Update properties of the existing trip with values from tripDto
                    _mapper.Map(activityDto, activity);

                    _context.Activities.Update(activity);
                    await _context.SaveChangesAsync();

                    var updatedActivityDto = _mapper.Map<GetActivityDto>(activity);
                    return Ok(updatedActivityDto);
                } else
                {
                    return Unauthorized("You are now allowed to edit this activity");
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteTrip(int id)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            var trip = await _context.Trips
                .Include(t => t.Cost) // Include the related Cost
                .Include(t => t.Activities)
                .SingleAsync(t => t.Id == id);

            if (trip == null)
            {
                return NotFound();
            }

            if (trip.UserId != userId)
            {
                return Unauthorized("You are not allowed to delete this trip");
            }

            foreach (var activity in trip.Activities)
            {
                _context.Activities.Remove(activity);
            }

            if (trip.Cost != null)
            {
                _context.Cost.Remove(trip.Cost);
            }
            _context.Trips.Remove(trip);

            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpPost("{tripId}/activity")]
        [Authorize]
        public async Task<ActionResult> AddActivity(int tripId, CreateActivityDto activityDto)
        {
            bool isSharedUser = false;
            string userEmail = User.FindFirst("https://your-namespace/email")?.Value;
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            var trip = await _context.Trips.Include(t => t.Activities).Include(t => t.Users).SingleAsync(t => t.Id == tripId);

            if (trip == null)
            {
                return NotFound();
            }

            if (trip.Users != null)
            {
                foreach (var user in trip.Users)
                {
                    if (user.Email == userEmail)
                    {
                        isSharedUser = true;
                    }
                }
            }

            if (isSharedUser || trip.UserId == userId)
            {
                var existingActivityType = _context.ActivityType.SingleOrDefault(at => at.Name == activityDto.ActivityType.Name);

                // Check if the ActivityType exists
                if (existingActivityType != null)
                {
                    // Use the existing ActivityType
                    activityDto.ActivityType = existingActivityType;
                }

                Entity.Activity activityToAdd = _mapper.Map<Entity.Activity>(activityDto);
                activityToAdd.TripId = tripId;

                trip.Activities.Add(activityToAdd);

                await _context.SaveChangesAsync();

                return Ok(activityToAdd);
            }
            else
            {
                return Unauthorized("You are not allowed to add an activity to this trip");
            }
        }

        [HttpDelete("activity/{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteActivity(int id)
        {
            bool isSharedUser = false;
            string userEmail = User.FindFirst("https://your-namespace/email")?.Value;
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            var activity = await _context.Activities
                .Include(a => a.Cost) // Include the related Cost
                .SingleAsync(a => a.Id == id);

            var trip = await _context.Trips.Include(t => t.Users).SingleAsync(t => t.Id == activity.TripId);

            if (activity == null)
            {
                return NotFound();
            }

            if (trip.Users != null)
            {
                foreach (var user in trip.Users)
                {
                    if (user.Email == userEmail)
                    {
                        isSharedUser = true;
                    }
                }
            }

            if (isSharedUser || trip.UserId == userId)
            {
                if (activity.Cost != null)
                {
                    _context.Cost.Remove(activity.Cost);
                }
                _context.Activities.Remove(activity);

                await _context.SaveChangesAsync();

                return NoContent();
            }
            else
            {
                return Unauthorized("You are not allowed to delete this activity");
            }
        }


        // Get ALL ACTIVITYTYPES
        [HttpGet("ActivityTypes")]
        [Authorize]
        public async Task<ActionResult<List<GetActivityTypeDto>>> GetActivityTypes()
        {
            var activityTypes = await _context.ActivityType
                .ToListAsync();

            if (activityTypes.Count == 0)
            {
                return NotFound();
            }

            return _mapper.Map<List<GetActivityTypeDto>>(activityTypes);
        }

        [HttpPut("cost/{id}")]
        [Authorize]
        public async Task<ActionResult<GetTripDto>> EditCost(int id, CreateCostDto costDto)
        {
            try
            {
                string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                var cost = await _context.Cost.Include(c => c.Trip).Include(c => c.Activity).ThenInclude(a => a.Trip).SingleAsync(c => c.Id == id);
                if (cost == null)
                {
                    return NotFound();
                }
                if (cost.Trip != null)
                {
                    if (cost.Trip.UserId != userId)
                    {
                        return Unauthorized();
                    }
                } else if (cost.Activity != null)
                {
                    if (cost.Activity.Trip.UserId != userId)
                    {
                        return Unauthorized();
                    }
                }

                // Update properties of the existing trip with values from tripDto
                _mapper.Map(costDto, cost);

                _context.Cost.Update(cost);
                await _context.SaveChangesAsync();

                var updatedCostDto = _mapper.Map<GetCostDto>(cost);
                return Ok(updatedCostDto);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [HttpDelete("cost/{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteCost(int id)
        {
            var cost = await _context.Cost.Include(c => c.Trip).ThenInclude(t => t!.Activities).ThenInclude(a => a.Cost).Include(c => c.Activity).ThenInclude(a => a!.Trip).SingleAsync(c => c.Id == id);

            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            

            if (cost == null)
            {
                return NotFound();
            }

            if (cost.Trip != null)
            {
                if (cost.Trip.UserId != userId)
                {
                    return Unauthorized();
                }
                foreach (var activity in cost.Trip.Activities)
                {
                    if (activity.Cost != null) _context.Cost.Remove(activity.Cost);
                }
            }

            if (cost.Activity != null)
            {
                if (cost.Activity.Trip.UserId != userId)
                {
                    return Unauthorized();
                }
            }   

            _context.Cost.Remove(cost);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("userTripCount")]
        [Authorize]
        public async Task<ActionResult<GetUserTripCountDto>> GetUserTripCount()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            var userTripCount = await _context.UserTripCount
                .FirstOrDefaultAsync(utc => utc.UserId == userId);

            // If the user doesn't have a trip count entry, return 0
            if (userTripCount == null)
            {
                return _mapper.Map<GetUserTripCountDto>(new GetUserTripCountDto { UserId = userId, TripCount = 0 });
            }

            return _mapper.Map<GetUserTripCountDto>(userTripCount);
        }
    }
}