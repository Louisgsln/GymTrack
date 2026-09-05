import 'react-native-url-polyfill/auto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { z } from 'zod';
import { DomainError } from '../utils/errors';
import type { RemoteRepository, SyncOperation } from '../sync/engine';

/** Explicit factory: never instantiate a fake client when configuration is absent. */
export function createSupabaseProvider(): SupabaseClient {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new DomainError('CONFIG_REQUIRED');
  z.url().parse(url);
  return createClient(url, key, {
    auth: {
      storage: {
        getItem: (name) => SecureStore.getItemAsync(name),
        setItem: (name, value) => SecureStore.setItemAsync(name, value),
        removeItem: (name) => SecureStore.deleteItemAsync(name),
      },
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}

export class SupabaseRemoteRepository implements RemoteRepository {
  constructor(private readonly client: SupabaseClient) {}
  async push(operation: SyncOperation) {
    const { data: session } = await this.client.auth.getSession();
    if (session.session?.user.id !== operation.owner_id)
      throw new DomainError('CONFIG_REQUIRED');
    const { data, error } = await this.client.rpc('apply_local_operation', {
      p_operation_id: operation.operation_id,
      p_entity_type: operation.entity_type,
      p_entity_id: operation.entity_id,
      p_base_revision: operation.base_revision,
      p_payload: JSON.parse(operation.payload) as unknown,
    });
    if (error) throw new Error('SYNC_TRANSPORT');
    return z.enum(['APPLIED', 'DUPLICATE', 'CONFLICT']).parse(data);
  }
}
