////package com.ai.smartrecruit.Service;
////
////import com.ai.smartrecruit.Model.User;
////import com.ai.smartrecruit.Repository.UserRepository;
////import com.ai.smartrecruit.Security.JwtService;
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.security.crypto.password.PasswordEncoder;
////import org.springframework.stereotype.Service;
////
////@Service
////public class AuthService {
////
////    @Autowired
////    private UserRepository userRepository;
////
////    @Autowired
////    private PasswordEncoder passwordEncoder;
////
////    @Autowired
////    private JwtService jwtService;
////
////
////    // REGISTER
////    public User register(User user) {
////
////        user.setPassword(
////                passwordEncoder.encode(user.getPassword())
////        );
////
////        return userRepository.save(user);
////    }
////
////
////    // LOGIN
////    public String login(String email, String password) {
////
////        User user = userRepository.findByEmail(email)
////                .orElseThrow(() ->
////                        new RuntimeException("User not found")
////                );
////
////        if (!passwordEncoder.matches(
////                password,
////                user.getPassword()
////        )) {
////            throw new RuntimeException("Invalid password");
////        }
////
////        // Generate JWT
////        return jwtService.generateToken(user);
////    }
////}
//
//
//package com.ai.smartrecruit.Service;
//
//import com.ai.smartrecruit.Model.User;
//import com.ai.smartrecruit.Repository.UserRepository;
//import com.ai.smartrecruit.Security.JwtService;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//public class AuthService {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final JwtService jwtService;
//
//    public AuthService(
//            UserRepository userRepository,
//            PasswordEncoder passwordEncoder,
//            JwtService jwtService
//    ) {
//        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
//        this.jwtService = jwtService;
//    }
//
//    // =========================
//    // REGISTER
//    // =========================
//    public User register(User user) {
//
//        user.setPassword(
//                passwordEncoder.encode(user.getPassword())
//        );
//
//        return userRepository.save(user);
//    }
//
//    // =========================
//    // LOGIN
//    // =========================
//    public String login(String email, String password) {
//
//        User user = userRepository
//                .findByEmail(email)
//                .orElseThrow(
//                        () -> new RuntimeException("User not found")
//                );
//
//        // Check password
//        if (!passwordEncoder.matches(
//                password,
//                user.getPassword()
//        )) {
//            throw new RuntimeException("Invalid password");
//        }
//
//        // Generate COMPLETE JWT
//        return jwtService.generateToken(user);
//    }
//}



package com.ai.smartrecruit.Service;

import com.ai.smartrecruit.Model.User;
import com.ai.smartrecruit.Repository.UserRepository;
import com.ai.smartrecruit.Security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    // =========================
    // REGISTER CANDIDATE / RECRUITER
    // =========================

    public User register(User user, String role) {

        if (user.getName() == null || user.getName().isBlank()
                || user.getEmail() == null || user.getEmail().isBlank()
                || user.getPassword() == null || user.getPassword().isBlank()) {

            throw new RuntimeException(
                    "Name, email and password are required"
            );
        }

        if (!role.equals("CANDIDATE") &&
                !role.equals("RECRUITER") &&
                !role.equals("ADMIN")) {

            throw new RuntimeException(
                    "Invalid registration role"
            );
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException(
                    "Email is already registered"
            );
        }

        // Never accept a role supplied by the frontend
        user.setRole(role);

        // Encrypt password
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    // =========================
    // ROLE-BASED LOGIN
    // =========================

    public String login(
            String email,
            String password,
            String expectedRole) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException("Invalid password");
        }

        if (!expectedRole.equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException(
                    "You are not authorized to use this login"
            );
        }

        //  Generate JWT
        return jwtService.generateToken(user);
    }

}

