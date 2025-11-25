import { Injectable } from '@nestjs/common';
import { MemStorage } from './storage';

@Injectable()
export class StorageService extends MemStorage {
    constructor() {
        super();
    }
}
