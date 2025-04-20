//package com.example.ra.demo;
//
//import com.example.ra.persistence.dao.TokenRepository;
//import com.example.ra.security.Services.CustomUserDetailsService;
//import com.example.ra.security.jwt.CookieAuthenticationFilter;
//import com.example.ra.security.jwt.JwtAuthenticationFilter;
//import com.example.ra.security.jwt.JwtService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.security.web.authentication.logout.LogoutHandler;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//import org.springframework.web.context.WebApplicationContext;
//
//import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//@ActiveProfiles("test")
//public class DemoControllerTest {
//
//    @Autowired
//    private WebApplicationContext context;
//
//    private MockMvc mockMvc;
//
//    @Autowired
//    public void setup() {
//        mockMvc = MockMvcBuilders
//                .webAppContextSetup(context)
//                .apply(springSecurity())
//                .build();
//    }
//
//
//    @Test
//   @WithMockUser(roles = "ADMIN")
//    void sayHello_WithAdminRole_ShouldReturnHelloMessage() throws Exception {
//        mockMvc.perform(get("/api/v1/demo-controller")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(content().string("Hello from secured endpoint (admin only)"))
//                .andDo(print());
//    }
//
//
//}