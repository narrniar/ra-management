//package com.example.ra.demo;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//import org.springframework.web.context.WebApplicationContext;
//
//import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
/// **
// * Integration tests for the ManagerController using @SpringBootTest
// * This loads the full application context and tests the controller with security
// */
//@SpringBootTest
//@ActiveProfiles("test")
//class ManagerControllerTest {
//
//    @Autowired
//    private WebApplicationContext context;
//
//    private MockMvc mockMvc;
//
//    @BeforeEach
//    void setUp() {
//        mockMvc = MockMvcBuilders
//                .webAppContextSetup(context)
//                .apply(springSecurity())
//                .build();
//    }
//
//    // GET tests
//
////    @Test
////    @WithMockUser(roles = "ADMIN")
////    void get_WithAdminRole_ShouldReturnSuccessMessage() throws Exception {
////        mockMvc.perform(get("/api/v1/management")
////                        .contentType(MediaType.APPLICATION_JSON))
////                .andExpect(status().isOk())
////                .andExpect(content().string("GET:: management controller"))
////                .andDo(print());
////    }
//
////    @Test
////    @WithMockUser(roles = "USER")
////    void get_WithUserRole_ShouldReturnForbidden() throws Exception {
////        mockMvc.perform(get("/api/v1/management")
////                        .contentType(MediaType.APPLICATION_JSON))
////                .andExpect(status().isForbidden())
////                .andDo(print());
////    }
////
////    @Test
////    void get_WithoutAuthentication_ShouldReturnUnauthorized() throws Exception {
////        mockMvc.perform(get("/api/v1/management")
////                        .contentType(MediaType.APPLICATION_JSON))
////                .andExpect(status().isUnauthorized())
////                .andDo(print());
////    }
////
////    // POST tests
////
//    @Test
//    @WithMockUser( authorities = {"admin:update", "ADMIN"})
//    void post_WithManagerCreateAuthority_ShouldReturnSuccessMessage() throws Exception {
//        mockMvc.perform(post("/api/v1/management")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(content().string("POST:: management controller"))
//                .andDo(print());
//    }
////
////    @Test
////    @WithMockUser(roles = "USER")
////    void post_WithUserRole_ShouldReturnForbidden() throws Exception {
////        mockMvc.perform(post("/api/v1/management")
////                        .contentType(MediaType.APPLICATION_JSON))
////                .andExpect(status().isForbidden())
////                .andDo(print());
////    }
////
////    @Test
////    void post_WithoutAuthentication_ShouldReturnUnauthorized() throws Exception {
////        mockMvc.perform(post("/api/v1/management")
////                        .contentType(MediaType.APPLICATION_JSON))
////                .andExpect(status().isUnauthorized())
////                .andDo(print());
////    }
////
////    // PUT tests
////
////    @Test
////    @WithMockUser(roles = "ADMIN")
////    void put_WithAdminRole_ShouldReturnSuccessMessage() throws Exception {
////        mockMvc.perform(put("/api/v1/management")
////                        .contentType(MediaType.APPLICATION_JSON))
////                .andExpect(status().isOk())
////                .andExpect(content().string("PUT:: management controller"))
////                .andDo(print());
////    }
////
////    @Test
////    @WithMockUser(roles = "USER")
////    void put_WithUserRole_ShouldReturnForbidden() throws Exception {
////        mockMvc.perform(put("/api/v1/management")
////                        .contentType(MediaType.APPLICATION_JSON))
////                .andExpect(status().isForbidden())
////                .andDo(print());
////    }
////
////    @Test
////    void put_WithoutAuthentication_ShouldReturnUnauthorized() throws Exception {
////        mockMvc.perform(put("/api/v1/management")
////                        .contentType(MediaType.APPLICATION_JSON))
////                .andExpect(status().isUnauthorized())
////                .andDo(print());
////    }
////
////    // DELETE tests
////
////    @Test
////    @WithMockUser(roles = "ADMIN")
////    void delete_WithAdminRole_ShouldReturnSuccessMessage() throws Exception {
////        mockMvc.perform(delete("/api/v1/management")
////                        .contentType(MediaType.APPLICATION_JSON))
////                .andExpect(status().isOk())
////                .andExpect(content().string("DELETE:: management controller"))
////                .andDo(print());
////    }
////
////    @Test
////    @WithMockUser(roles = "USER")
////    void delete_WithUserRole_ShouldReturnForbidden() throws Exception {
////        mockMvc.perform(delete("/api/v1/management")
////                        .contentType(MediaType.APPLICATION_JSON))
////                .andExpect(status().isForbidden())
////                .andDo(print());
////    }
////
////    @Test
////    void delete_WithoutAuthentication_ShouldReturnUnauthorized() throws Exception {
////        mockMvc.perform(delete("/api/v1/management")
////                        .contentType(MediaType.APPLICATION_JSON))
////                .andExpect(status().isUnauthorized())
////                .andDo(print());
////    }
//}