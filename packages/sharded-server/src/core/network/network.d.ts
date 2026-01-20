export type MessageType = 'SHARD_STOP_REQUEST' | 'SHARD_STOPPED_OK' | 'LOG_SYNC' | 'HEARTBEAT';

export interface NetworkMessage {
  type: MessageType;
  shardId?: number;
  payload?: any;
  sender: string;
}