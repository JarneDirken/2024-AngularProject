namespace TripPlannerBackend.API.Dto
{
    public class CreateUserDto
    {
        public string? Email { get; set; }
        public string? Picture { get; set; }
        public int TripId { get; set; }
    }
}
