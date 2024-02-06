using TripPlannerBackend.API.Entity;

namespace TripPlannerBackend.API.Initializer
{
    public class DBInitializer
    {
        public static void Initialize(TripPlannerDbContext context)
        {
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            //if (!context.Cost.Any())
            //{
            //    var costs = new Cost[]
            //    {
            //        new Cost {Amount = 400.0, Currency = Currency.EUR},
            //        new Cost {Amount = 400.0, Currency = Currency.EUR}
            //    };

            //    foreach (var cost in costs)
            //    {
            //        context.Cost.Add(cost);
            //    }
            //}

            if (!context.ActivityType.Any())
            {
                var activityTypes = new ActivityType[]
                {
                    new ActivityType {Name = "Flight"},
                    new ActivityType {Name = "Hotel"},
                    new ActivityType {Name = "Amusement park"},
                    new ActivityType {Name = "Swimming"},
                    new ActivityType {Name = "Other"}
                };

                foreach (ActivityType a in activityTypes)
                {
                    context.ActivityType.Add(a);
                }

                context.SaveChanges();
            }

            if (!context.UserTripCount.Any())
            {  
                var userTripCounts = new UserTripCount[]
                {
                    new UserTripCount { UserId = "google-oauth2|113753475576448472778", TripCount = 2}, //jarne
                    new UserTripCount {UserId = "auth0|6571d85c45e0c3e71a438faf", TripCount = 3}, //user1
                    new UserTripCount {UserId = "auth0|6571da4da1027c81f5db9f75", TripCount = 1}, //user2
                    new UserTripCount {UserId = "auth0|6571da7fe33a2ab7e6dd23bd", TripCount = 0}, //user3
                };

                foreach (UserTripCount utc in userTripCounts)
                {
                    context.UserTripCount.Add(utc);
                }

                context.SaveChanges();
            }

            // Seed the Trips table with some dummy data
            if (!context.Trips.Any())
            {
                var trips = new Trip[]
                {
                new Trip {
                    Name = "Disneyland Paris",
                    Location = "Paris",
                    Image = "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAWU5eFhS64QxmaqEDj6o5c1eLDsQNrHgID650eu1YvzQ3EGSDCc_ty_jatUZUl35i5kD_kpqy3CbI23uON0VDA20eSbU4EOSSjP2fGiV5X2R2azlCvRaO90ndG5zYu-qIWJtHT_b-QPl2FeVOb8C6pcNmxZNB3slS_CYvoTMmfQf0XTeHgFd&3u500&5m1&2e1&callback=none&key=AIzaSyASy1HLLl_7VmSmA4vIT0FujdjAfWnHGUU&token=83399",
                    Cost= new Cost { Amount = 1000.0, Currency = Currency.EUR },
                    Type=TripType.city,
                    Start = DateTime.Now.AddDays(30),
                    End = DateTime.Now.AddDays(35),
                    UserId = "google-oauth2|113753475576448472778",
                    Count = 0,
                    Activities = new List<Activity>()
                {
                    new Activity(){
                        Name="Flight ticket",
                        Cost=  new Cost { Amount = 400.0, Currency = Currency.EUR },
                        ActivityType = context.ActivityType.First(a => a.Name == "Flight"),
                        Description="Our flight in zaventem to paris",
                        Location="Zaventem",
                        Start = DateTime.Now.AddDays(30),
                        End = DateTime.Now.AddDays(30)},
                    new Activity(){
                        Name="Hotel",
                        Cost=  new Cost { Amount = 300.0, Currency = Currency.EUR },
                        ActivityType = context.ActivityType.First(a => a.Name == "Hotel"),
                        Description="Hotel booked in Paris",
                        Location="Paris",
                        Start = DateTime.Now.AddDays(30),
                        End = DateTime.Now.AddDays(34)},
                    new Activity(){
                        Name="Amusement park",
                        Cost=  new Cost { Amount = 150.0, Currency = Currency.EUR },
                        ActivityType = context.ActivityType.First(a => a.Name == "Amusement park"),
                        Description="Ticket Disneyland Paris",
                        Location="Paris",
                        Start = DateTime.Now.AddDays(31),
                        End = DateTime.Now.AddDays(32)},
                    new Activity(){
                        Name="Swimming",
                        Cost=  new Cost { Amount = 40.0, Currency = Currency.EUR },
                        ActivityType = context.ActivityType.First(a => a.Name == "Swimming"),
                        Description="Swmming at a local pool",
                        Location="Paris",
                        Start = DateTime.Now.AddDays(33),
                        End = DateTime.Now.AddDays(33)},
                },
                    Users = new List<User>()
                    {
                        new User(){Email="dirkendigital@gmail.com"},
                        new User(){Email="chxdiii@gmail.com"}
                    },
                },
                new Trip {
                    Name = "Demo trip",
                    Location = "Thailand",
                    Image = "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAWU5eFjO73C1aY1DCvRtggTt6xFQwpMZBPolo898XjikVKbsKplmxANoM6Ak3-ZE9Hcw7HfO8ymg6W2pxMTkOOSLUyDds6ZwZLtPa-Tetv5vAaeBZYAS7nDGMjRlbQ3OjzCqis8RA4UUdyU7QPAqGq4bWGsb2aXZQ_eiABL4GhBP0LlkPYOf&3u500&5m1&2e1&callback=none&key=AIzaSyASy1HLLl_7VmSmA4vIT0FujdjAfWnHGUU&token=70205",
                    Cost= new Cost { Amount = 1500.0, Currency = Currency.EUR },
                    Type=TripType.road,
                    Start = DateTime.Now.AddDays(20),
                    End = DateTime.Now.AddDays(27),
                    UserId = "google-oauth2|114861365760661817519", //dd@gmail
                    Count = 549,
                    IsPublic = true,
                    Activities = new List<Activity>()
                    {
                    new Activity(){
                        Name="Thailand",
                        Cost=  new Cost { Amount = 1200.0, Currency = Currency.EUR },
                        ActivityType = context.ActivityType.First(a => a.Name == "Flight"),
                        Description="Flight to Thailand",
                        Location="Thailand",
                        Start = DateTime.Now.AddDays(20),
                        End = DateTime.Now.AddDays(27)},
                    new Activity(){
                        Name="AirBnb",
                        Cost=  new Cost { Amount = 310.0, Currency = Currency.EUR },
                        ActivityType = context.ActivityType.First(a => a.Name == "Other"),
                        Description="AirBNB booked in Thailand",
                        Location="Bangkok",
                        Start = DateTime.Now.AddDays(20),
                        End = DateTime.Now.AddDays(27)},
                    },
                    Users = new List<User>()
                    {
                        new User(){Email="jarnedirken@gmail.com"},
                    },
                },
                new Trip {
                    Name = "Beach Vacation",
                    Location = "Hawai",
                    Image = "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAWU5eFhQ1BEl3mKu7UPrvVUNmodWhHVfOXv8I5OPxbSQF0sc4qbyYBoZiv-yC2WYuuMqTMKLM_tHnvWAq__4Qnq4Yo1pzc8vISK4NujUR7LnwOKMi4K7nMAkBmvt2Wa5297HmUVZEQBLPwMoDeGWUyi9hj3abJ6WpWWFu7elPBQE8IFotYln&3u500&5m1&2e1&callback=none&key=AIzaSyASy1HLLl_7VmSmA4vIT0FujdjAfWnHGUU&token=56178",
                    Cost = new Cost { Amount = 1200.0, Currency = Currency.USD },
                    Type = TripType.beach,
                    Start = DateTime.Now.AddDays(10),
                    End = DateTime.Now.AddDays(17),
                    UserId = "google-oauth2|113753475576448472778", //jd@gmail
                    Count = 0,
                    IsPublic = false,
                    Activities = new List<Activity>()
                {
                    new Activity(){
                        Name = "Beachfront Hotel",
                        Cost =  new Cost { Amount = 600.0, Currency = Currency.USD },
                        ActivityType = context.ActivityType.First(a => a.Name == "Hotel"),
                        Description = "Luxury beachfront hotel",
                        Location = "Tropical Paradise",
                        Start = DateTime.Now.AddDays(10),
                        End = DateTime.Now.AddDays(17)
                    },
                    new Activity(){
                        Name = "Scuba Diving",
                        Cost =  new Cost { Amount = 300.0, Currency = Currency.USD },
                        ActivityType = context.ActivityType.First(a => a.Name == "Other"),
                        Description = "Scuba diving adventure",
                        Location = "Underwater Haven",
                        Start = DateTime.Now.AddDays(11),
                        End = DateTime.Now.AddDays(11)
                    },
                    new Activity(){
                        Name = "Beach Party",
                        Cost =  new Cost { Amount = 150.0, Currency = Currency.USD },
                        ActivityType = context.ActivityType.First(a => a.Name == "Other"),
                        Description = "Night party on the beach",
                        Location = "Tropical Paradise",
                        Start = DateTime.Now.AddDays(13),
                        End = DateTime.Now.AddDays(13)
                    },
                },
                    Users = new List<User>()
                    {
                        new User(){Email="dirkendigital@gmail.com"},
                    },
                },
                new Trip {
                    Name = "Disneyland Paris",
                    Location = "Paris",
                    Image = "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAWU5eFg8DMLGb6gmekxZX6Cp5DPXdMVJXu7h4x-HnAj7jAqKOz21OnxW4Fd6KhzXfr8BLJle5Tr72KGkTdocbbl2boophvnvcZD1QFoiPscDFaZ7Ik2KVWBPlzlwCmPCrY0v4zPOmCz7gRx3NFCXLsGtKQAKmgfiTac2AJnsOtPxUJxIiYEi&3u500&5m1&2e1&callback=none&key=AIzaSyASy1HLLl_7VmSmA4vIT0FujdjAfWnHGUU&token=59566",
                    Cost= new Cost { Amount = 1000.0, Currency = Currency.EUR },
                    Type=TripType.city,
                    Start = DateTime.Now.AddDays(30),
                    End = DateTime.Now.AddDays(35),
                    UserId = "google-oauth2|101904096967779749000",
                    Count = 0,
                    Activities = new List<Activity>()
                {
                    new Activity(){
                        Name="Flight ticket",
                        Cost=  new Cost { Amount = 400.0, Currency = Currency.EUR },
                        ActivityType = context.ActivityType.First(a => a.Name == "Flight"),
                        Description="Our flight in zaventem to paris",
                        Location="Zaventem",
                        Start = DateTime.Now.AddDays(30),
                        End = DateTime.Now.AddDays(30)},
                    new Activity(){
                        Name="Hotel",
                        Cost=  new Cost { Amount = 300.0, Currency = Currency.EUR },
                        ActivityType = context.ActivityType.First(a => a.Name == "Hotel"),
                        Description="Hotel booked in Paris",
                        Location="Paris",
                        Start = DateTime.Now.AddDays(30),
                        End = DateTime.Now.AddDays(34)},
                    new Activity(){
                        Name="Amusement park",
                        Cost=  new Cost { Amount = 150.0, Currency = Currency.EUR },
                        ActivityType = context.ActivityType.First(a => a.Name == "Amusement park"),
                        Description="Ticket Disneyland Paris",
                        Location="Paris",
                        Start = DateTime.Now.AddDays(31),
                        End = DateTime.Now.AddDays(32)},
                    new Activity(){
                        Name="Swimming",
                        Cost=  new Cost { Amount = 40.0, Currency = Currency.EUR },
                        ActivityType = context.ActivityType.First(a => a.Name == "Swimming"),
                        Description="Swmming at a local pool",
                        Location="Paris",
                        Start = DateTime.Now.AddDays(33),
                        End = DateTime.Now.AddDays(33)},
                },
                    Users = new List<User>()
                    {
                        new User(){Email="jen.verboven@outlook.com"},
                        new User(){Email="r0889629@student.thomasmore.be"}
                    },
                },
                new Trip {
                    Name = "Public Disneyland Paris",
                    Location = "Paris",
                    Image = "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAWU5eFg8DMLGb6gmekxZX6Cp5DPXdMVJXu7h4x-HnAj7jAqKOz21OnxW4Fd6KhzXfr8BLJle5Tr72KGkTdocbbl2boophvnvcZD1QFoiPscDFaZ7Ik2KVWBPlzlwCmPCrY0v4zPOmCz7gRx3NFCXLsGtKQAKmgfiTac2AJnsOtPxUJxIiYEi&3u500&5m1&2e1&callback=none&key=AIzaSyASy1HLLl_7VmSmA4vIT0FujdjAfWnHGUU&token=59566",
                    Cost= new Cost { Amount = 1000.0, Currency = Currency.EUR },
                    Type=TripType.city,
                    Start = DateTime.Now.AddDays(30),
                    End = DateTime.Now.AddDays(35),
                    UserId = "google-oauth2|101904096967779749000",
                    Count = 54,
                    IsPublic = true,
                    Activities = new List<Activity>()
                {
                    new Activity(){
                        Name="Flight ticket",
                        Cost=  new Cost { Amount = 400.0, Currency = Currency.EUR },
                        ActivityType = context.ActivityType.First(a => a.Name == "Flight"),
                        Description="Our flight in zaventem to paris",
                        Location="Zaventem",
                        Start = DateTime.Now.AddDays(30),
                        End = DateTime.Now.AddDays(30)},
                    new Activity(){
                        Name="Hotel",
                        Cost=  new Cost { Amount = 300.0, Currency = Currency.EUR },
                        ActivityType = context.ActivityType.First(a => a.Name == "Hotel"),
                        Description="Hotel booked in Paris",
                        Location="Paris",
                        Start = DateTime.Now.AddDays(30),
                        End = DateTime.Now.AddDays(34)},
                    new Activity(){
                        Name="Amusement park",
                        Cost=  new Cost { Amount = 150.0, Currency = Currency.EUR },
                        ActivityType = context.ActivityType.First(a => a.Name == "Amusement park"),
                        Description="Ticket Disneyland Paris",
                        Location="Paris",
                        Start = DateTime.Now.AddDays(31),
                        End = DateTime.Now.AddDays(32)},
                    new Activity(){
                        Name="Swimming",
                        Cost=  new Cost { Amount = 40.0, Currency = Currency.EUR },
                        ActivityType = context.ActivityType.First(a => a.Name == "Swimming"),
                        Description="Swmming at a local pool",
                        Location="Paris",
                        Start = DateTime.Now.AddDays(33),
                        End = DateTime.Now.AddDays(33)},
                },
                    Users = new List<User>()
                    {
                        new User(){Email="jen.verboven@outlook.com"}
                    },
                },
                new Trip
                {
                    Name = "Trip to Brussels and the Atomium",
                    Location = "Atomium",
                    Image = "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAWU5eFjWwTx0wEZxl2gqsCvMhFyArPpdcRRVPHH7ft7n-X9LGUV_qHlc8e367uSoL8L5rxsG__yLhaZP811iqpBpJEd2ELWLKu-7soflBeqf-rUl5EmMCJL896J2i4UVxljR7Fx34oELxFT5Y1MxYe2A_fHd115OIh_jdLI9uyNgRF2rnLAZ&3u500&5m1&2e1&callback=none&key=AIzaSyASy1HLLl_7VmSmA4vIT0FujdjAfWnHGUU&token=84849",
                    Type = TripType.city,
                    Start = DateTime.Now.AddDays(-3),
                    End = DateTime.Now.AddDays(-2),
                    UserId = "auth0|6571d85c45e0c3e71a438faf",
                    Count = 12,
                    Cost = new Cost
                    {
                        Amount = 300.0,
                        Currency = Currency.EUR,
                    },
                    Users = new List<User>()
                    {
                        new User(){Email="user2@example.com"},
                    },
                    Activities = new List<Activity>()
                    {
                        new Activity(){
                            Name="Flight to Brussels",
                            Cost=  new Cost { Amount = 70.0, Currency = Currency.EUR },
                            ActivityType = context.ActivityType.First(a => a.Name == "Flight"),
                            Description="The flight from home to Brussels",
                            Location="Airport",
                            Start = DateTime.Now.AddDays(-3),
                            End = DateTime.Now.AddDays(-3)},
                        new Activity(){
                            Name="Visiting the Atomium",
                            Cost=  new Cost { Amount = 40.0, Currency = Currency.EUR },
                            ActivityType = context.ActivityType.First(a => a.Name == "Other"),
                            Description="Visiting the Atomium",
                            Location="Atomium",
                            Start = DateTime.Now.AddDays(-3),
                            End = DateTime.Now.AddDays(-3)},
                        new Activity(){
                            Name="Going to Mini-Europe",
                            Cost=  new Cost { Amount = 20.0, Currency = Currency.EUR },
                            ActivityType = context.ActivityType.First(a => a.Name == "Amusement park"),
                            Description="Go to the amusement park Mini-Europe",
                            Location="Mini-Europe",
                            Start = DateTime.Now.AddDays(-2),
                            End = DateTime.Now.AddDays(-2)},
                        new Activity(){
                            Name="Flight Home",
                            Cost=  new Cost { Amount = 70.0, Currency = Currency.EUR },
                            ActivityType = context.ActivityType.First(a => a.Name == "Flight"),
                            Description="The flight from Brussels back home",
                            Location="Zaventem",
                            Start = DateTime.Now.AddDays(-2),
                            End = DateTime.Now.AddDays(-2)},
                    },
                    IsPublic = true
                },
                new Trip
                {
                    Name = "Daytrip to the Grand Canyon",
                    Location = "Grand Canyon",
                    Image = "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAWU5eFguu8EjCslAXllRhaaakqfIfLNpdVwPGl2ZhecxbmwVGQSMqMEuB4GOVk8OBCsaFwlgbiqsjlkR8zlnkb2Jeb6goZbFJprAxStl_9T1BRPxPggEsSKnVfbuCkq9jpAjW3hYGkMje2APa613qzPCv4FsIQYh1LrfOK1D72lhH_kdcMKD&3u500&5m1&2e1&callback=none&key=AIzaSyASy1HLLl_7VmSmA4vIT0FujdjAfWnHGUU&token=27252",
                    Type = TripType.historical,
                    Start = DateTime.Now.AddDays(7),
                    End = DateTime.Now.AddDays(7),
                    UserId = "auth0|6571d85c45e0c3e71a438faf",
                    Count = 0,
                    Cost = new Cost
                    {
                        Amount = 700.0,
                        Currency = Currency.USD,
                    },
                    Users = new List<User>()
                    {},
                    Activities = new List<Activity>()
                    {
                        new Activity(){
                            Name="Zipline",
                            Cost=  new Cost { Amount = 140.0, Currency = Currency.USD },
                            ActivityType = context.ActivityType.First(a => a.Name == "Other"),
                            Description="Take a zipline through the Grand Canyon",
                            Location="Grand Canyon",
                            Start = DateTime.Now.AddDays(7),
                            End = DateTime.Now.AddDays(7)},
                        new Activity(){
                            Name="Guided tour",
                            Cost=  new Cost { Amount = 110.0, Currency = Currency.USD },
                            ActivityType = context.ActivityType.First(a => a.Name == "Other"),
                            Description="Get a guide to tell the history of the Grand Canyon",
                            Location="Grand Canyon",
                            Start = DateTime.Now.AddDays(7),
                            End = DateTime.Now.AddDays(7)},
                    },
                    IsPublic = false
                },
                new Trip
                {
                    Name = "Roadtrip through Britain",
                    Location = "Great Britain",
                    Image = "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAWU5eFjJTT-neimlLGZSBQXd64uIvzR9-KCN1SaVxGQZgM5Md4XfsERc2BjCL2igsHgyxhupyqEPCxAZfbJnZEAY7Jdo5ibG4dql-0Wx08VxVdnryt1QXBdChgZLoHuFGigT5oF3f8jTtHW83jTf9SwNtHZzR6Hvl_9bPhPhVaFhM_E_Xln7&3u500&5m1&2e1&callback=none&key=AIzaSyASy1HLLl_7VmSmA4vIT0FujdjAfWnHGUU&token=31140",
                    Type = TripType.road,
                    Start = DateTime.Now.AddDays(12),
                    End = DateTime.Now.AddDays(16),
                    UserId = "auth0|6571d85c45e0c3e71a438faf",
                    Count = 0,
                    Cost = new Cost
                    {
                        Amount = 2000.0,
                        Currency = Currency.GBP,
                    },
                    Users = new List<User>()
                    {
                        new User(){Email="user2@example.com"},
                        new User(){Email="user3@example.com"},
                    },
                    Activities = new List<Activity>()
                    {
                        new Activity(){
                            Name="Flight to London",
                            Cost=  new Cost { Amount = 360.0, Currency = Currency.GBP },
                            ActivityType = context.ActivityType.First(a => a.Name == "Flight"),
                            Description="Flight from Zaventem to Heathrow Airport",
                            Location="Zaventem",
                            Start = DateTime.Now.AddDays(12),
                            End = DateTime.Now.AddDays(12)},
                        new Activity(){
                            Name="Hike through London",
                            Cost=  new Cost { Amount = 30.0, Currency = Currency.GBP },
                            ActivityType = context.ActivityType.First(a => a.Name == "Other"),
                            Description="See London and have a drink",
                            Location="London",
                            Start = DateTime.Now.AddDays(12),
                            End = DateTime.Now.AddDays(12)},
                        new Activity(){
                            Name="Hotel in London",
                            Cost=  new Cost { Amount = 400.0, Currency = Currency.GBP },
                            ActivityType = context.ActivityType.First(a => a.Name == "Hotel"),
                            Description="First hotel of the trip",
                            Location="Premier Inn London Tolworth hotel",
                            Start = DateTime.Now.AddDays(12),
                            End = DateTime.Now.AddDays(13)},
                        new Activity(){
                            Name="Visit Greenford",
                            Cost=  new Cost { Amount = 65.0, Currency = Currency.GBP },
                            ActivityType = context.ActivityType.First(a => a.Name == "Other"),
                            Description="Take a tour through Greenford",
                            Location="Greenford",
                            Start = DateTime.Now.AddDays(13),
                            End = DateTime.Now.AddDays(13)},
                        new Activity(){
                            Name="Hotel in Birmingham",
                            Cost=  new Cost { Amount = 500.0, Currency = Currency.GBP },
                            ActivityType = context.ActivityType.First(a => a.Name == "Hotel"),
                            Description="Second hotel of the trip",
                            Location="Travelodge Birmingham Central Broadway Plaza",
                            Start = DateTime.Now.AddDays(14),
                            End = DateTime.Now.AddDays(15)},
                        new Activity(){
                            Name="Visit Birmingham",
                            Cost=  new Cost { Amount = 150.0, Currency = Currency.GBP },
                            ActivityType = context.ActivityType.First(a => a.Name == "Other"),
                            Description="Take a tour through Birmingham",
                            Location="Birmingham",
                            Start = DateTime.Now.AddDays(14),
                            End = DateTime.Now.AddDays(14)},
                        new Activity(){
                            Name="Visit Wolverhampton",
                            Cost=  new Cost { Amount = 50.0, Currency = Currency.GBP },
                            ActivityType = context.ActivityType.First(a => a.Name == "Other"),
                            Description="Take a tour through Wolverhampton",
                            Location="Wolverhampton",
                            Start = DateTime.Now.AddDays(15),
                            End = DateTime.Now.AddDays(15)},
                        new Activity(){
                            Name="Visit Leicester",
                            Cost=  new Cost { Amount = 100.0, Currency = Currency.GBP },
                            ActivityType = context.ActivityType.First(a => a.Name == "Other"),
                            Description="Take a tour through Leicester",
                            Location="Leicester",
                            Start = DateTime.Now.AddDays(16),
                            End = DateTime.Now.AddDays(16)},
                        new Activity(){
                            Name="Flight to Brussels",
                            Cost=  new Cost { Amount = 360.0, Currency = Currency.GBP },
                            ActivityType = context.ActivityType.First(a => a.Name == "Flight"),
                            Description="Flight from Heathrow Airport to Zaventem",
                            Location="Heathrow Airport",
                            Start = DateTime.Now.AddDays(16),
                            End = DateTime.Now.AddDays(16)},
                    },
                    IsPublic = false
                },
                new Trip
                {
                    Name = "Daytrip to the Eiffel Tower",
                    Location = "Eiffel Tower",
                    Image = "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAWU5eFjjVMhJ5iJ0igtotEhoyq6XaNfgXSAi0Y3Hd8TOyjx4KIJG0JPcOy9KAJPhm5WmJzAYHaXSxGTFs3kyHthtz9GmDU_QjoZWgy0cNZsgq0KrKWmOTE7QvIYbUkK68_kpOkXCPmdLEU2KAK9bKA7YfEN9GCbNUNel0yRe4srXJ04WpzNl&3u500&5m1&2e1&callback=none&key=AIzaSyASy1HLLl_7VmSmA4vIT0FujdjAfWnHGUU&token=131065",
                    Type = TripType.city,
                    Start = DateTime.Now.AddDays(23),
                    End = DateTime.Now.AddDays(23),
                    UserId = "auth0|6571da4da1027c81f5db9f75",
                    Count = 32,
                    Cost = new Cost
                    {
                        Amount = 700.0,
                        Currency = Currency.USD,
                    },
                    Users = new List<User>()
                    {},
                    Activities = new List<Activity>()
                    {
                        new Activity(){
                            Name="Eiffel tower",
                            Cost=  new Cost { Amount = 110.0, Currency = Currency.USD },
                            ActivityType = context.ActivityType.First(a => a.Name == "Other"),
                            Description="Seeing the Eiffel tower",
                            Location="Eiffel tower",
                            Start = DateTime.Now.AddDays(23),
                            End = DateTime.Now.AddDays(23)},
                    },
                    IsPublic = true
                },
                };

                foreach (Trip t in trips)
                {
                    context.Trips.Add(t);
                }

                context.SaveChanges();
            }
        }
    }
}