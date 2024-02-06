using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripPlannerBackend.API.Entity
{
    public class User
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public string? Picture { get; set; }
        public int TripId { get; set; }
        public Trip Trip { get; set; }
    }
}
