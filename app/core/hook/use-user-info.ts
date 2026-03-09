import type { User } from '~type/user.type';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import userService from '~service/user.service';
import tokenService from '~service/token.service';

const getUserInfo = userService.getMe.bind(userService);

export const useUserInfo = () => {
    const queryClient = useQueryClient();
    const queryKey = ['get_user_info'];

    const user = queryClient.getQueryData<User>(queryKey);
    const tokens = tokenService.getToken();

    return {
        query: useQuery({
            queryKey,
            queryFn: getUserInfo,
            staleTime: user ? 1000 * 60 * 30 : undefined,
            enabled: !!tokens,
        }),
        setData: (data: User | null) => queryClient.setQueryData(queryKey, data),
    };
};
