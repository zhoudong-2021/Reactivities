using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Persistence;
using Application.Activities;
using Application.Core;
using AutoMapper;
using MediatR;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services, 
            IConfiguration config)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });

            services.AddDbContext<DataContext>(opt => 
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            // Allow cross origin policy
            services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policy => {
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("Http://localhost:3000");
                });
            });

            // Add Mediator, AutoMapper
            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            
            return services;
        }

        
    }
}