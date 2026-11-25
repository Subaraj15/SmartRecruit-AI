//package com.ai.smartrecruit.Security;
//
//import com.ai.smartrecruit.Service.CustomUserDetailsService;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.web.servlet.FilterRegistrationBean;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//
//import org.springframework.security.config.http.SessionCreationPolicy;
//
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//import java.util.Arrays;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    @Autowired
//    private JwtFilter jwtFilter;
//
//    @Autowired
//    private CustomUserDetailsService userDetailsService;
//
//
//    // ==============================
//    // PASSWORD ENCODER
//    // ==============================
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//
//    // ==============================
//    // AUTHENTICATION PROVIDER
//    // ==============================
//
//    @Bean
//    public AuthenticationProvider authenticationProvider() {
//
//        DaoAuthenticationProvider provider =
//                new DaoAuthenticationProvider(userDetailsService);
//
//        provider.setPasswordEncoder(passwordEncoder());
//
//        return provider;
//    }
//
//
//    // ==============================
//    // AUTHENTICATION MANAGER
//    // ==============================
//
//    @Bean
//    public AuthenticationManager authenticationManager(
//            AuthenticationConfiguration configuration)
//            throws Exception {
//
//        return configuration.getAuthenticationManager();
//    }
//
//
//    // ==============================
//    // CORS
//    // ==============================
//
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//
//        CorsConfiguration configuration =
//                new CorsConfiguration();
//
//        configuration.setAllowedOrigins(
//                Arrays.asList(
//                        "http://localhost:5173",
//                        "http://localhost:5174",
//                        "http://localhost:5175",
//                        "http://localhost:5176",
//                        "http://localhost:5177",
//                        "http://localhost:5178"
//                )
//        );
//
//        configuration.setAllowedMethods(
//                Arrays.asList(
//                        "GET",
//                        "POST",
//                        "PUT",
//                        "DELETE",
//                        "OPTIONS"
//                )
//        );
//
//        configuration.setAllowedHeaders(
//                Arrays.asList("*")
//        );
//
//        configuration.setAllowCredentials(true);
//
//        UrlBasedCorsConfigurationSource source =
//                new UrlBasedCorsConfigurationSource();
//
//        source.registerCorsConfiguration(
//                "/**",
//                configuration
//        );
//
//        return source;
//    }
//
//
//    // ==============================
//    // SECURITY FILTER CHAIN
//    // ==============================
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(
//            HttpSecurity http)
//            throws Exception {
//
//        http
//
//                .csrf(csrf -> csrf.disable())
//
//                .cors(cors ->
//                        cors.configurationSource(
//                                corsConfigurationSource()
//                        )
//                )
//
//                .authenticationProvider(
//                        authenticationProvider()
//                )
//
//                .authorizeHttpRequests(auth -> auth
//
//                        // CORS preflight
//                        .requestMatchers(
//                                org.springframework.http.HttpMethod.OPTIONS,
//                                "/**"
//                        ).permitAll()
//
//                        // Login/Register
//                        .requestMatchers(
//                                "/api/auth/**"
//                        ).permitAll()
//
//                        // Jobs
////                        .requestMatchers(
////                                "/api/jobs/**"
////                        ).permitAll()
//
//                                .requestMatchers(
//                                        org.springframework.http.HttpMethod.GET,
//                                        "/api/jobs/my-jobs"
//                                ).hasRole("RECRUITER")
//
//                                .requestMatchers("/api/jobs/**").permitAll()
//
//                                // Applications — temporarily public for diagnosis
//                                .requestMatchers("/api/applications/**").permitAll()
//
//// AI matching — require a valid login
//                                .requestMatchers("/api/matches/**").authenticated()
//
//// Everything else
//                                .anyRequest().authenticated()
//                )
//
//                .sessionManagement(session ->
//                        session.sessionCreationPolicy(
//                                SessionCreationPolicy.STATELESS
//                        )
//                )
//
//                .addFilterBefore(
//                        jwtFilter,
//                        UsernamePasswordAuthenticationFilter.class
//                );
//
//        return http.build();
//    }
//
//
//    // ==============================
//    // PREVENT DOUBLE FILTER
//    // ==============================
//
//    @Bean
//    public FilterRegistrationBean<JwtFilter>
//    jwtFilterRegistration(JwtFilter filter) {
//
//        FilterRegistrationBean<JwtFilter> registration =
//                new FilterRegistrationBean<>(filter);
//
//        registration.setEnabled(false);
//
//        return registration;
//    }
//}


package com.ai.smartrecruit.Security;

import com.ai.smartrecruit.Service.CustomUserDetailsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    // PASSWORD ENCODER
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AUTHENTICATION PROVIDER
    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    // AUTHENTICATION MANAGER
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    // CORS CONFIGURATION
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:5173",
                        "http://localhost:5174",
                        "http://localhost:5175",
                        "http://localhost:5176",
                        "http://localhost:5177",
                        "http://localhost:5178"
                )
        );

        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                Arrays.asList("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // SECURITY FILTER CHAIN
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .authenticationProvider(
                        authenticationProvider()
                )

//                .authorizeHttpRequests(auth -> auth
//
//                        // CORS preflight requests
//                        .requestMatchers(
//                                org.springframework.http.HttpMethod.OPTIONS,
//                                "/**"
//                        ).permitAll()
//
//                        // Registration and login
//                        .requestMatchers(
//                                "/api/auth/**"
//                        ).permitAll()
//
//                        // RECRUITER: POST JOB
//                        .requestMatchers(
//                                org.springframework.http.HttpMethod.POST,
//                                "/api/jobs"
//                        ).hasRole("RECRUITER")
//
//                        // RECRUITER: VIEW OWN JOBS
//                        .requestMatchers(
//                                org.springframework.http.HttpMethod.GET,
//                                "/api/jobs/my-jobs"
//                        ).hasRole("RECRUITER")
//
//                        // RECRUITER: UPDATE JOB
//                        .requestMatchers(
//                                org.springframework.http.HttpMethod.PUT,
//                                "/api/jobs/**"
//                        ).hasRole("RECRUITER")
//
//                        // RECRUITER: DELETE JOB
//                        .requestMatchers(
//                                org.springframework.http.HttpMethod.DELETE,
//                                "/api/jobs/**"
//                        ).hasRole("RECRUITER")
//
//                        // PUBLIC: VIEW ALL JOBS
//                        .requestMatchers(
//                                org.springframework.http.HttpMethod.GET,
//                                "/api/jobs"
//                        ).permitAll()
//
//                        // PUBLIC: VIEW JOB DETAILS
//                        .requestMatchers(
//                                org.springframework.http.HttpMethod.GET,
//                                "/api/jobs/*"
//                        ).permitAll()
//
//                        // APPLICATIONS - TEMPORARY
//                        .requestMatchers(
//                                "/api/applications/**"
//                        ).permitAll()
//
//                        // AI MATCHING - LOGIN REQUIRED
//                        .requestMatchers(
//                                "/api/matches/**"
//                        ).authenticated()
//
//                        // EVERYTHING ELSE
//                        .anyRequest().authenticated()
//                )



                .authorizeHttpRequests(auth -> auth

                        // CORS preflight
                        .requestMatchers(
                                org.springframework.http.HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Login and registration
                        .requestMatchers("/api/auth/**").permitAll()

                        // ADMIN access
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Recruiter job management
                        .requestMatchers(
                                org.springframework.http.HttpMethod.POST,
                                "/api/jobs"
                        ).hasRole("RECRUITER")

                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,
                                "/api/jobs/my-jobs"
                        ).hasRole("RECRUITER")

                        .requestMatchers(
                                org.springframework.http.HttpMethod.PUT,
                                "/api/jobs/**"
                        ).hasRole("RECRUITER")

                        .requestMatchers(
                                org.springframework.http.HttpMethod.DELETE,
                                "/api/jobs/**"
                        ).hasRole("RECRUITER")

                        // Public job browsing
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,
                                "/api/jobs",
                                "/api/jobs/*"
                        ).permitAll()

                        // Resume upload and resume access
                        .requestMatchers("/api/resumes/**").authenticated()

                        // Applications - temporarily public
                        .requestMatchers("/api/applications/**").permitAll()

                        // AI matching requires authentication
                        .requestMatchers("/api/matches/**").authenticated()

                        // Everything else
                        .anyRequest().authenticated()
                )


                // STATELESS SESSION
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // JWT FILTER
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // PREVENT DOUBLE JWT FILTER REGISTRATION
    @Bean
    public FilterRegistrationBean<JwtFilter>
    jwtFilterRegistration(JwtFilter filter) {

        FilterRegistrationBean<JwtFilter> registration =
                new FilterRegistrationBean<>(filter);

        registration.setEnabled(false);

        return registration;
    }
}
