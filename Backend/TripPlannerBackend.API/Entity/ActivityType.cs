using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripPlannerBackend.API.Entity
{
    public class ActivityType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Activity>? Activities { get; set; }
    }
}
