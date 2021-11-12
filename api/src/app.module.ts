import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user';
import { Qualification } from './qualifications/qualification';
import { Interest } from './interests/interest';
import { Specie } from './species/specie';
import { Monster } from './monsters/monster';
import { Company } from './companies/company';
import { Occupation } from './occupations/occupation';
import { Project } from './projects/project';
import { Group } from './groups/group';
import { Invitation } from './invitations/invitation';
import { List } from './lists/list';
import { ListSort } from './list-sorts/list-sort';
import { Task } from './tasks/task';
import { Allocation } from './allocations/allocation';
import { Chat } from './chats/chat';
import { Log } from './logs/log';
import { UsersModule } from './users/users.module';
import { QualificationsModule } from './qualifications/qualifications.module';
import { InterestsModule } from './interests/interests.module';
import { SpeciesModule } from './species/species.module';
import { MonstersModule } from './monsters/monsters.module';
import { CompaniesModule } from './companies/companies.module';
import { OccupationsModule } from './occupations/occupations.module';
import { ProjectsModule } from './projects/projects.module';
import { GroupsModule } from './groups/groups.module';
import { InvitationsModule } from './invitations/invitations.module';
import { ListsModule } from './lists/lists.module';
import { ListSortsModule } from './list-sorts/list-sorts.module';
import { TasksModule } from './tasks/tasks.module';
import { AllocationsModule } from './allocations/allocations.module';
import { ChatsModule } from './chats/chats.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      debug: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db-server',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'taosk_db',
      entities: [
        User,
        Qualification,
        Interest,
        Specie,
        Monster,
        Company,
        Occupation,
        Project,
        Group,
        Invitation,
        List,
        ListSort,
        Task,
        Allocation,
        Chat,
        Log,
      ],
      synchronize: true,
    }),
    UsersModule,
    QualificationsModule,
    InterestsModule,
    SpeciesModule,
    MonstersModule,
    CompaniesModule,
    OccupationsModule,
    ProjectsModule,
    GroupsModule,
    InvitationsModule,
    ListsModule,
    ListSortsModule,
    TasksModule,
    AllocationsModule,
    ChatsModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
