package com.example.ra.persistence.services;


import com.example.ra.persistence.dao.TokenRepository;
import com.example.ra.persistence.dao.UserRepository;
import com.example.ra.persistence.models.TOKEN.Token;
import com.example.ra.persistence.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;


    public User getUser(final String JwtToken) {
        final Token token = tokenRepository.findByToken(JwtToken);
        if (token != null) {
            return token.getUser();
        }
        return null;
    }

    public void deleteUser(final User user) {

        tokenRepository.deleteByUser(user);

        userRepository.delete(user);

//        final PasswordResetToken passwordToken = passwordTokenRepository.findByUser(user);
//
//        if (passwordToken != null) {
//            passwordTokenRepository.delete(passwordToken);
//        }
//
//        userRepository.delete(user);
    }
}
