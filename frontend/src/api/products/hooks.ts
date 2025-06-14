import { useMutation } from '@tanstack/react-query';
import { $fetch } from '@/lib/http/client';
import { queryClient } from '../client';
import { useRouter } from '@tanstack/react-router';

type CreateProductData = {
  imageUrl: string | undefined;
  imageId: string | undefined;
  title: string;
  productType: string;
  price: number;
  unitType: string;
  stock: number;
  description?: string | undefined;
};

export function useCreateProduct() {
  const router = useRouter();
  return useMutation({
    mutationKey: ['products', 'create'] as const,
    mutationFn: (createProductData: CreateProductData) =>
      $fetch('@post/api/shop/products', { body: createProductData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.navigate({ to: '/seller' });
    },
  });
}
