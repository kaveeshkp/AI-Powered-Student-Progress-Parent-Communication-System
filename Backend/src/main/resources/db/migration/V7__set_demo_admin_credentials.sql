UPDATE app_users
SET email = 'admin@example.com',
    password = '$2a$10$4Agj.JjXyiIbrTurUmT.ROX.YPE2mPKfV6vQN9L/l0G54cbX1n2oa',
    updated_at = NOW()
WHERE id = 1;
