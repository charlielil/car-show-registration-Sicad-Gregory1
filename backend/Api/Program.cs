using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Application.Features.Registrations.CreateRegistration;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrationSummary;
using Application.Features.Registrations.GetRegistrations;
using Api.Features.Registrations;
using Domain.Common;
using FluentValidation;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Database (SQLite file: carshow.db). Migrations live in the Infrastructure project.
builder.Services.AddDbContext<IAppDbContext, AppDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=carshow.db",
        sqlite => sqlite.MigrationsAssembly(typeof(AppDbContext).Assembly.GetName().Name)));

// CORS: allow the React dev server (Vite)
const string FrontendCorsPolicy = "Frontend";
builder.Services.AddCors(options =>
    options.AddPolicy(FrontendCorsPolicy, policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()));

// Validators
builder.Services.AddValidatorsFromAssembly(typeof(IAppDbContext).Assembly);

// Handlers
builder.Services.AddScoped<ICommandHandler<CreateRegistrationCommand, Result<RegistrationDto>>, CreateRegistrationHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationsQuery, Result<PagedRegistrationsResponse>>, GetRegistrationsHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationByIdQuery, Result<RegistrationDto>>, GetRegistrationByIdHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationSummaryQuery, Result<RegistrationSummaryResponse>>, GetRegistrationSummaryHandler>();

builder.Services.ConfigureHttpJsonOptions(options =>
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Info.Title = "Car Show Registration System API";
        document.Info.Description = "API for car show registrations, payments, and registration summaries.";
        return Task.CompletedTask;
    });
});

var app = builder.Build();

// Apply pending migrations, then seed sample records (only when the table is empty).
using (var scope = app.Services.CreateScope())
{
    var dbContext = (AppDbContext)scope.ServiceProvider.GetRequiredService<IAppDbContext>();
    await DatabaseSeeder.SeedAsync(dbContext);
}

app.UseCors(FrontendCorsPolicy);

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapGet("/", () => "Car Show Registration API. Go to /scalar/v1 for API documentation.");

// Map endpoints
app.MapRegistrationEndpoints();

app.Run();

public partial class Program;
