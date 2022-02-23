using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Comments;
using Application.profiles;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : AutoMapper.Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s =>
                    s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.Username, o => o.MapFrom(x => x.AppUser.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(x => x.AppUser.DisplayName))
                .ForMember(d => d.Bio, o => o.MapFrom(x => x.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(x =>
                    x.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowerCount, o => o.MapFrom(x => x.AppUser.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(x => x.AppUser.Followings.Count))
                .ForMember(d => d.IsFollowing, o => o.MapFrom(x =>
                    x.AppUser.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<AppUser, profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(x => x.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowerCount, o => o.MapFrom(x => x.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(x => x.Followings.Count))
                .ForMember(d => d.IsFollowing, o => o.MapFrom(x =>
                    x.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.Username, o => o.MapFrom(x => x.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(x => x.Author.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(x =>
                    x.Author.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<ActivityAttendee, UserActivityDto>()
                .ForMember(d => d.Id, o => o.MapFrom(x => x.ActivityId))
                .ForMember(d => d.Title, o => o.MapFrom(x => x.Activity.Title))
                .ForMember(d => d.Category, o => o.MapFrom(x => x.Activity.Category))
                .ForMember(d => d.Date, o => o.MapFrom(x => x.Activity.Date))
                .ForMember(d => d.HostUsername, o => o.MapFrom(x => 
                    x.Activity.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));
                

        }
    }
}