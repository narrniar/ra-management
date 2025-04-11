package com.example.ra.persistence.dao;

import com.example.ra.persistence.models.Token;
import com.example.ra.persistence.models.TokenType;
import com.example.ra.persistence.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {

    @Query(value = """
    select t from Token t inner join User u
    on t.user.id = u.id
    where u.id = :id and t.expiresAt < :now
    """)
    List<Token> findAllValidTokensByUser(Long id);

//    SEARCH METHODS
    Token findByToken(String token);

    Token findByUserAndTokenType(User user, TokenType tokenType);
//  DELETE METHODS
    @Modifying
    @Query("DELETE FROM Token t WHERE t.user = :user AND t.tokenType = :tokenType")
    void deleteByUserAndTokenType(@Param("user") User user, @Param("tokenType") TokenType tokenType);

    @Modifying
    @Query("DELETE FROM Token t WHERE t.user = :user")
    void deleteByUser(@Param("user") User user);


    @Modifying
    @Query("DELETE FROM Token t WHERE t.token = :token")
    void deleteByToken(@Param("token") String token);


    @Modifying
    @Query("DELETE FROM Token t WHERE t.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") Instant now);



}
