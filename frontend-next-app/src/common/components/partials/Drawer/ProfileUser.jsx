import { User } from '@heroui/react';
import React from 'react';

const ProfileUser = ({ fullname, level_name }) => {
  return (
    <div className='flex w-full justify-start items-center mt-2'>
      <User
        avatarProps={{ radius: 'lg' }}
        description={level_name || ''}
        name={fullname || ''}
        classNames={{
          name: 'line-clamp-1',
        }}
      />
    </div>
  );
};

export default ProfileUser;
