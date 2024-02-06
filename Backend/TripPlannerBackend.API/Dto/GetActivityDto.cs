using TripPlannerBackend.API.Entity;

namespace TripPlannerBackend.API.Dto
{
    public class GetActivityDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public GetCostDto Cost { get; set; }
        public GetActivityTypeDto ActivityType { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string? Description { get; set; }
        public string Location { get; set; }
    }
}