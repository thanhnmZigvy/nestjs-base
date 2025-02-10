export type GetBody<
  Paths extends Record<string, any>,
  Path extends keyof Paths,
  Method extends keyof Paths[Path],
  ContentType extends
    keyof Paths[Path][Method]['requestBody']['content'] = 'application/x-www-form-urlencoded',
> = Paths[Path][Method]['requestBody']['content'][ContentType];
export type GetQuery<
  Paths extends Record<string, any>,
  Path extends keyof Paths,
  Method extends keyof Paths[Path],
> = Paths[Path][Method]['parameters']['query'];
export type GetResponse<
  Paths extends Record<string, any>,
  Path extends keyof Paths,
  Method extends keyof Paths[Path],
  ContentType extends
    keyof Paths[Path][Method]['requestBody']['content'] = 'application/json',
> = Paths[Path][Method]['responses']['200']['content'][ContentType];
