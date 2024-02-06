using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TripPlannerBackend.API.Entity;

namespace TripPlannerBackend.API.Dto
{
    public class CreateTripDto
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public string Image { get; set; }
        public TripType? Type { get; set; }
        public string UserId { get; set; }
        public CreateCostDto? Cost { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public IEnumerable<CreateUserDto> Users { get; set; }

        public IEnumerable<CreateActivityDto> Activities { get; set; }
        public bool IsPublic { get; set; }
    }
}