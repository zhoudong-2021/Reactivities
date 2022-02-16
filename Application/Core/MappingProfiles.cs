using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s =>
                    s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.Username, o => o.MapFrom(x => x.AppUser.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(x => x.AppUser.DisplayName))
                .ForMember(d => d.Bio, o => o.MapFrom(x => x.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(x =>
                    x.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<AppUser, profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(x => x.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.Username, o => o.MapFrom(x => x.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(x => x.Author.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(x =>
                    x.Author.Photos.FirstOrDefault(x => x.IsMain).Url));


        }
    }
}