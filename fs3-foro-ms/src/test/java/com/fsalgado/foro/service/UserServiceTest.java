package com.fsalgado.foro.service;

import com.fsalgado.foro.DTO.UserDTO;
import com.fsalgado.foro.enums.UserRole;
import com.fsalgado.foro.model.User;
import com.fsalgado.foro.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllUsers() {
        User user = createSampleUser();
        when(userRepository.findAll()).thenReturn(List.of(user));

        List<UserDTO> result = userService.getAllUsers();

        assertEquals(1, result.size());
        assertEquals(user.getUsername(), result.get(0).getUsername());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testCreateUser() {
        UserDTO dto = createSampleUserDTO();
        User user = new User();
        user.setId(1L);
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());

        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDTO result = userService.createUser(dto);

        assertEquals(dto.getUsername(), result.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testGetUserById_found() {
        User user = createSampleUser();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<UserDTO> result = userService.getUserById(1L);

        assertTrue(result.isPresent());
        assertEquals(user.getUsername(), result.get().getUsername());
    }

    @Test
    void testGetUserById_notFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<UserDTO> result = userService.getUserById(1L);

        assertTrue(result.isEmpty());
    }

    @Test
    void testUpdateUser_found() {
        User existingUser = createSampleUser();
        UserDTO updateDto = new UserDTO(null, "nuevo", "claveNueva", UserRole.ADMIN);

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDTO result = userService.updateUser(1L, updateDto);

        assertEquals("nuevo", result.getUsername());
        assertEquals("claveNueva", result.getPassword());
        assertEquals(UserRole.ADMIN, result.getRole());
    }

    @Test
    void testUpdateUser_notFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                userService.updateUser(1L, new UserDTO())
        );

        assertEquals("Usuario no encontrado", ex.getMessage());
    }

    @Test
    void testDeleteUser() {
        userService.deleteUser(1L);
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void testLogin_success() {
        User user = createSampleUser();
        when(userRepository.findByUsername("felipe")).thenReturn(Optional.of(user));

        boolean result = userService.login("felipe", "clave123");

        assertTrue(result);
    }

    @Test
    void testLogin_wrongPassword() {
        User user = createSampleUser();
        user.setPassword("otraClave");
        when(userRepository.findByUsername("felipe")).thenReturn(Optional.of(user));

        boolean result = userService.login("felipe", "clave123");

        assertFalse(result);
    }

    @Test
    void testLogin_userNotFound() {
        when(userRepository.findByUsername("noExiste")).thenReturn(Optional.empty());

        boolean result = userService.login("noExiste", "clave123");

        assertFalse(result);
    }

    private User createSampleUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("felipe");
        user.setPassword("clave123");
        user.setRole(UserRole.USER);
        return user;
    }

    private UserDTO createSampleUserDTO() {
        return new UserDTO(null, "felipe", "clave123", UserRole.USER);
    }
}
