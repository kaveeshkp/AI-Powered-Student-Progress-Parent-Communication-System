-- Set test credentials for all demo users
-- Standard password for all: 'password'
-- Hash: $2a$10$4Agj.JjXyiIbrTurUmT.ROX.YPE2mPKfV6vQN9L/l0G54cbX1n2oa

UPDATE app_users
SET password = '$2a$10$4Agj.JjXyiIbrTurUmT.ROX.YPE2mPKfV6vQN9L/l0G54cbX1n2oa'
WHERE id = 1;

UPDATE app_users
SET password = '$2a$10$4Agj.JjXyiIbrTurUmT.ROX.YPE2mPKfV6vQN9L/l0G54cbX1n2oa'
WHERE id = 2;

UPDATE app_users
SET password = '$2a$10$4Agj.JjXyiIbrTurUmT.ROX.YPE2mPKfV6vQN9L/l0G54cbX1n2oa'
WHERE id = 3;
