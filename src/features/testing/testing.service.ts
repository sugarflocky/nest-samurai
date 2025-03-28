import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TestingService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async deleteAllData() {
    try {
      await this.dataSource.query(`
      DO $$ 
DECLARE 
    r RECORD; 
BEGIN 
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP 
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE'; 
    END LOOP; 
END $$;
`);
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
