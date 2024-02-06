using AutoMapper;
using TripPlannerBackend.API.Dto;
using TripPlannerBackend.API.Entity;

namespace TripPlannerBackend.API.Mapper
{
    public class AutoMapper : Profile
    {
        public AutoMapper()
        {

            CreateMap<GetTripDto, Trip>();
            CreateMap<CreateTripDto, Trip>();
            CreateMap<EditTripDto, Trip>();
            CreateMap<Trip, GetTripDto>();
            //.ForMember(dest => dest.Name, act => act.MapFrom(src => src.TripName));
            CreateMap<Activity, GetActivityDto>();
            CreateMap<GetActivityDto, Activity>();
            CreateMap<CreateActivityDto, Activity>();
            CreateMap<Activity, CreateActivityDto>();

            CreateMap<Activity, EditActivityDto>();
            CreateMap<EditActivityDto, Activity>();

            CreateMap<CreateUserDto, User>();
            CreateMap<GetUserDto, User>();
            CreateMap<User, GetUserDto>();

            CreateMap<ActivityType, GetActivityTypeDto>();
            CreateMap<GetActivityTypeDto,ActivityType > ();


            CreateMap<GetCostDto, Cost>();
            CreateMap<Cost,GetCostDto>();
            CreateMap<CreateCostDto, Cost>();
            CreateMap<Cost,CreateCostDto>();

            CreateMap<UserTripCount, GetUserTripCountDto>();
            CreateMap<GetUserTripCountDto, UserTripCount>();
        }
    }
}