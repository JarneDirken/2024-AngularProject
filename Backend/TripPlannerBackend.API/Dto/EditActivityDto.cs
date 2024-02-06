using TripPlannerBackend.API.Entity;

namespace TripPlannerBackend.API.Dto
{
    public class EditActivityDto
    {
        public string Name { get; set; }
        public CreateCostDto? Cost { get; set; }
        public GetActivityTypeDto ActivityType { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string? Description { get; set; }
        public string Location { get; set; }
    }
}