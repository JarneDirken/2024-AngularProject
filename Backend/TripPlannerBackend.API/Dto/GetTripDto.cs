using System.ComponentModel.DataAnnotations.Schema;
using TripPlannerBackend.API.Entity;

namespace TripPlannerBackend.API.Dto
{
    public class GetTripDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string Image { get; set; }
        public TripType Type { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string UserId { get; set; }
        public GetCostDto Cost { get; set; }
        public IEnumerable<GetUserDto> Users { get; set; }
        public IEnumerable<GetActivityDto> Activities { get; set; }
        public bool IsPublic { get; set; }
        public int Count { get; set; }
    }
}