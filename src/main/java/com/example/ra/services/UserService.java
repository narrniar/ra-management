import com.example.ra.persistence.dao.UserRepository;
import com.example.ra.persistence.models.User;
import com.example.ra.web.DTO.UserDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserService implements IUserService {
    @Autowired
    private UserRepository repository;

    @Override
    public User registerNewUserAccount(UserDto userDto) throws UserAlreadyExistException {
        if (emailExists(userDto.getEmail())) {
            throw new UserAlreadyExistException("There is an account with that email address: "
                    + userDto.getEmail());
        }

        // the rest of the registration operation
    }
    private boolean emailExists(String email) {
        return userRepository.findByEmail(email) != null;
    }
}