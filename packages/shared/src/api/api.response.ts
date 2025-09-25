export type ApiResponse<
  T extends Record<string, unknown> | undefined = undefined,
> = T extends undefined
  ? // No data case
    | {
          success: true;
          message?: string;
        }
      | {
          success: false;
          error?: string;
          details?: Record<string, unknown>;
        }
  : // With data case
    {
      success: true;
      message?: string;
    } & T;
