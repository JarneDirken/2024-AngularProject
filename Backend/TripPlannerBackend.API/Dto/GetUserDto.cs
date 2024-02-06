namespace TripPlannerBackend.API.Dto
{
    public class GetUserDto
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public string? Picture { get; set; }
        public int TripId { get; set; }
    }
}
