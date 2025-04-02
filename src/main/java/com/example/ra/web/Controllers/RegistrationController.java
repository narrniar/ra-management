package com.example.ra.web.Controllers;

import com.example.ra.web.DTO.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/user")
public class RegistrationController {

    @GetMapping("/registration")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new UserDto());
        return "registration";
    }

    @PostMapping("/registration")
    public ModelAndView registerUserAccount(
            @ModelAttribute("user") @Valid UserDto userDto,
            HttpServletRequest request,
            Errors errors) {

        try {
            User registered = userService.registerNewUserAccount(userDto);
        } catch (UserAlreadyExistException uaeEx) {
            mav.addObject("message", "An account for that username/email already exists.");
            return mav;
        }

        // rest of the implementation
    }
}