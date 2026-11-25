    //package com.ai.smartrecruit.Controller;
    //
    //import com.ai.smartrecruit.Model.User;
    //import com.ai.smartrecruit.Service.AuthService;
    //import org.springframework.http.ResponseEntity;
    //import org.springframework.web.bind.annotation.*;
    //
    //import java.util.Map;
    //
    //@RestController
    //@RequestMapping("/api/auth")
    //@CrossOrigin(origins = {
    //        "http://localhost:5173",
    //        "http://localhost:5174",
    //        "http://localhost:5175",
    //        "http://localhost:5176",
    //        "http://localhost:5177",
    //        "http://localhost:5178"
    //})
    //public class AuthController {
    //
    //    private final AuthService authService;
    //
    //    public AuthController(AuthService authService) {
    //        this.authService = authService;
    //    }
    //
    //    // ==========================================
    //    // REGISTER
    //    // ==========================================
    //
    //    @PostMapping("/register")
    //    public ResponseEntity<?> register(
    //            @RequestBody User user) {
    //
    //        User savedUser = authService.register(user);
    //
    //        return ResponseEntity.ok(savedUser);
    //    }
    //
    //    // ==========================================
    //    // LOGIN
    //    // ==========================================
    //
    //    @PostMapping("/login")
    //    public ResponseEntity<?> login(
    //            @RequestBody User user) {
    //
    //        String token = authService.login(
    //                user.getEmail(),
    //                user.getPassword()
    //        );
    //
    //        System.out.println("=================================");
    //        System.out.println("LOGIN SUCCESS");
    //        System.out.println("JWT TOKEN GENERATED:");
    //        System.out.println(token);
    //        System.out.println("JWT PARTS: " + token.split("\\.").length);
    //        System.out.println("=================================");
    //
    //        return ResponseEntity.ok(
    //                Map.of("token", token)
    //        );
    //    }
    //}


    package com.ai.smartrecruit.Controller;

    import com.ai.smartrecruit.Model.User;
    import com.ai.smartrecruit.Service.AuthService;

    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.beans.factory.annotation.Value;

    import java.util.Map;

    @RestController
    @RequestMapping("/api/auth")
    @CrossOrigin(origins = {
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:5176",
            "http://localhost:5177",
            "http://localhost:5178"
    })
    public class AuthController {

        private final AuthService authService;

        @Value("${admin.registration-code}")
        private String adminRegistrationCode;

        public AuthController(AuthService authService) {
            this.authService = authService;
        }

        // CANDIDATE REGISTRATION
        @PostMapping("/candidate/register")
        public ResponseEntity<?> candidateRegister(@RequestBody User user) {

            User savedUser = authService.register(user, "CANDIDATE");

            return ResponseEntity.ok(Map.of(
                    "id", savedUser.getId(),
                    "name", savedUser.getName(),
                    "email", savedUser.getEmail(),
                    "role", savedUser.getRole()
            ));
        }

        // RECRUITER REGISTRATION
        @PostMapping("/recruiter/register")
        public ResponseEntity<?> recruiterRegister(@RequestBody User user) {

            User savedUser = authService.register(user, "RECRUITER");

            return ResponseEntity.ok(Map.of(
                    "id", savedUser.getId(),
                    "name", savedUser.getName(),
                    "email", savedUser.getEmail(),
                    "role", savedUser.getRole()
            ));
        }

        // CANDIDATE LOGIN
        @PostMapping("/candidate/login")
        public ResponseEntity<?> candidateLogin(@RequestBody User user) {

            String token = authService.login(
                    user.getEmail(),
                    user.getPassword(),
                    "CANDIDATE"
            );

            return ResponseEntity.ok(Map.of("token", token));
        }

        // RECRUITER LOGIN
        @PostMapping("/recruiter/login")
        public ResponseEntity<?> recruiterLogin(@RequestBody User user) {

            String token = authService.login(
                    user.getEmail(),
                    user.getPassword(),
                    "RECRUITER"
            );

            return ResponseEntity.ok(Map.of("token", token));
        }


        // ADMIN REGISTRATION
        @PostMapping("/admin/register")
        public ResponseEntity<?> adminRegister(@RequestBody Map<String, String> request) {

            if (!adminRegistrationCode.equals(request.get("adminCode"))) {
                return ResponseEntity.badRequest().body("Invalid Admin registration code");
            }

            User user = new User();
            user.setName(request.get("name"));
            user.setEmail(request.get("email"));
            user.setPassword(request.get("password"));

            User savedUser = authService.register(user, "ADMIN");

            return ResponseEntity.ok(Map.of(
                    "id", savedUser.getId(),
                    "name", savedUser.getName(),
                    "email", savedUser.getEmail(),
                    "role", savedUser.getRole()
            ));
        }

        // ADMIN LOGIN - NO ADMIN REGISTRATION
        @PostMapping("/admin/login")
        public ResponseEntity<?> adminLogin(@RequestBody User user) {

            String token = authService.login(
                    user.getEmail(),
                    user.getPassword(),
                    "ADMIN"
            );

            return ResponseEntity.ok(Map.of("token", token));
        }

        // BACKWARD-COMPATIBLE CANDIDATE ENDPOINTS
        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody User user) {
            return candidateRegister(user);
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody User user) {
            return candidateLogin(user);
        }
    }
