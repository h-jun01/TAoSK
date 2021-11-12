import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user';
import { Interest } from 'src/interests/interest';
import { Qualification } from 'src/qualifications/qualification';
import { Group } from 'src/groups/group';
import { Invitation } from 'src/invitations/invitation';
import { Log } from 'src/logs/log';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Interest]),
    TypeOrmModule.forFeature([Qualification]),
    TypeOrmModule.forFeature([Group]),
    TypeOrmModule.forFeature([Invitation]),
    TypeOrmModule.forFeature([Log]),
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
