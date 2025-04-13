package com.fsalgado.foro.service;

import com.fsalgado.foro.DTO.UserDTO;
import com.fsalgado.foro.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

import com.fsalgado.foro.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDTO(user.getId(), user.getUsername(), user.getPassword(), user.getRole()))
                .collect(Collectors.toList());
    }

    public UserDTO createUser(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setRole(userDTO.getRole());
        User saved = userRepository.save(user);
        return new UserDTO(saved.getId(), saved.getUsername(), saved.getPassword(), saved.getRole());
    }

    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id)
                .map(user -> new UserDTO(user.getId(), user.getUsername(), user.getPassword(), user.getRole()));
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setUsername(userDTO.getUsername());
                    user.setPassword(userDTO.getPassword());
                    user.setRole(userDTO.getRole());
                    User updated = userRepository.save(user);
                    return new UserDTO(updated.getId(), updated.getUsername(), updated.getPassword(), updated.getRole());
                })
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean login(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user -> user.getPassword().equals(password))
                .orElse(false);
    }
}
