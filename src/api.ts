

export type UserType = {
  _id?: string;
  username: string;
  password: string;
  token: string;
}
export type ImplementationType = {
  _id?: string;
  name: string;
  Author: Partial<UserType> | string;
}
export type ImpType = {
  _id?: string;
  code: string;
  Implementation: Partial<ImplementationType> | string;
  version: string;
}
const slothking: (host:string, fn:(url:string, params:{ props:{[x:string]:any}, method?: 'GET'|'POST'|'PATCH'|'DELETE'|'PUT' })=>Promise<any> ) => {
  user: {
    name: string;
    endpoints: {
      refresh: (params:{props:         {
          token?: string;
          username?: string;
        },method?: 'GET'|'POST'|'PATCH'|'DELETE'|'PUT'}) => Promise<        {
          username: string;
          token: string;
        }>;
      auth: (params:{props:         {
          token?: string;
          username?: string;
        },method?: 'GET'|'POST'|'PATCH'|'DELETE'|'PUT'}) => Promise<        {
          username: string;
          token: string;
        }>;
      register: (params:{props:         {
          username?: string;
          password?: string;
        },method?: 'GET'|'POST'|'PATCH'|'DELETE'|'PUT'}) => Promise<        {
          username: string;
          token: string;
        }>;
      login: (params:{props:         {
          username?: string;
          password?: string;
        },method?: 'GET'|'POST'|'PATCH'|'DELETE'|'PUT'}) => Promise<        {
          username: string;
          token: string;
        }>;
      changePassword: (params:{props:         {
          password?: string;
          newPassword?: string;
        },method?: 'GET'|'POST'|'PATCH'|'DELETE'|'PUT'}) => Promise<        {
          username: string;
          token: string;
        }>;
      resetPassword: (params:{props:         {
          username?: string;
        },method?: 'GET'|'POST'|'PATCH'|'DELETE'|'PUT'}) => Promise<        {}>;
      resetPasswordFromLink: (params:{props:         {
          newPassword?: string;
          linkToken?: string;
        },method?: 'GET'|'POST'|'PATCH'|'DELETE'|'PUT'}) => Promise<        {}>;
      github: (params:{props:         {
          code?: string;
        },method?: 'GET'|'POST'|'PATCH'|'DELETE'|'PUT'}) => Promise<        {
          username: string;
          token: string;
        }>;
    };
  };
  imp: {
    name: string;
    endpoints: {
      initImp: (params:{props:         {
          name: string;
          token?: string;
        },method?: 'GET'|'POST'|'PATCH'|'DELETE'|'PUT'}) => Promise<        {
          Implementation: ImplementationType;
        }>;
      updateImp: (params:{props:         {
          Imp: Partial<ImpType> | string;
          name?: string;
          token?: string;
        },method?: 'GET'|'POST'|'PATCH'|'DELETE'|'PUT'}) => Promise<        {
          Imp: ImpType;
        }>;
      removeImp: (params:{props:         {
          name?: string;
          token?: string;
        },method?: 'GET'|'POST'|'PATCH'|'DELETE'|'PUT'}) => Promise<        {}>;
      searchImp: (params:{props:         {
          query?: string;
        },method?: 'GET'|'POST'|'PATCH'|'DELETE'|'PUT'}) => Promise<        {
          Imp: ImpType[];
        }>;
      getImp: (params:{props:         {
          name: string;
          version?: string;
        },method?: 'GET'|'POST'|'PATCH'|'DELETE'|'PUT'}) => Promise<        {
          Imp: ImpType;
        }>;
    };
  };
} = (host,fn) => ({
  user: {
    name: 'user',
    endpoints: {
      refresh: ({props,method='POST'}) => fn(`${host}user/refresh`,{
        props,
       method,
      }).then(res => res.json()),
      auth: ({props,method='POST'}) => fn(`${host}user/auth`,{
        props,
       method,
      }).then(res => res.json()),
      register: ({props,method='POST'}) => fn(`${host}user/register`,{
        props,
       method,
      }).then(res => res.json()),
      login: ({props,method='POST'}) => fn(`${host}user/login`,{
        props,
       method,
      }).then(res => res.json()),
      changePassword: ({props,method='POST'}) => fn(`${host}user/changePassword`,{
        props,
       method,
      }).then(res => res.json()),
      resetPassword: ({props,method='POST'}) => fn(`${host}user/resetPassword`,{
        props,
       method,
      }).then(res => res.json()),
      resetPasswordFromLink: ({props,method='POST'}) => fn(`${host}user/resetPasswordFromLink`,{
        props,
       method,
      }).then(res => res.json()),
      github: ({props,method='POST'}) => fn(`${host}user/github`,{
        props,
       method,
      }).then(res => res.json())
    }
  },
  imp: {
    name: 'imp',
    endpoints: {
      initImp: ({props,method='POST'}) => fn(`${host}imp/initImp`,{
        props,
       method,
      }).then(res => res.json()),
      updateImp: ({props,method='POST'}) => fn(`${host}imp/updateImp`,{
        props,
       method,
      }).then(res => res.json()),
      removeImp: ({props,method='POST'}) => fn(`${host}imp/removeImp`,{
        props,
       method,
      }).then(res => res.json()),
      searchImp: ({props,method='POST'}) => fn(`${host}imp/searchImp`,{
        props,
       method,
      }).then(res => res.json()),
      getImp: ({props,method='POST'}) => fn(`${host}imp/getImp`,{
        props,
       method,
      }).then(res => res.json())
    }
  }
});
export default slothking;