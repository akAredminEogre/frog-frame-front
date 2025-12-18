/**
 * ID指定でルールを取得するリクエストDTO
 */
export interface GetByIdRequestDTO {
  action: 'getById';
  id: number;
}
