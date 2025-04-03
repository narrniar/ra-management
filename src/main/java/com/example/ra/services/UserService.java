package com.example.ra.services;

import com.example.ra.persistence.dao.UserRepository;
import com.example.ra.persistence.models.User;
import com.example.ra.web.DTO.UserDto;
import com.example.ra.web.errors.UserAlreadyExistException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SessionRegistry sessionRegistry;

    public User registerNewUserAccount(UserDto userDto) throws UserAlreadyExistException {
        if (emailExists(userDto.getEmail())) {
            throw new UserAlreadyExistException("There is an account with that email address: " + userDto.getEmail());
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setRole("ROLE_USER");
        user.setEnabled(false); // Will be enabled after verification

        return userRepository.save(user);
    }

    private boolean emailExists(String email) {
        return userRepository.findByEmail(email) != null;
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void saveRegisteredUser(User user) {
        userRepository.save(user);
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    public Optional<User> getUserByID(long id) {
        return userRepository.findById(id);
    }

    public void changeUserPassword(User user, String password) {
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    public boolean checkIfValidOldPassword(User user, String oldPassword) {
        return passwordEncoder.matches(oldPassword, user.getPassword());
    }

    public List<String> getUsersFromSessionRegistry() {
        return sessionRegistry.getAllPrincipals().stream()
                .filter(principal -> principal instanceof User)
                .map(principal -> ((User) principal).getEmail())
                .collect(Collectors.toList());
    }

    public User updateUser2FA(boolean use2FA) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        user.setUsing2FA(use2FA);
        return userRepository.save(user);
    }

    public String generateQRUrl(User user) throws UnsupportedEncodingException {
        return String.format(
                "https://chart.googleapis.com/chart?chs=200x200&chld=M%%7C0&cht=qr&chl=otpauth://totp/%s:%s?secret=%s&issuer=%s",
                URLEncoder.encode("AppName", "UTF-8"),
                URLEncoder.encode(user.getEmail(), "UTF-8"),
                user.getSecret(),
                URLEncoder.encode("AppName", "UTF-8"));
    }
}