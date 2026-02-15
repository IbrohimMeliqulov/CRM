import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { CoursesModule } from './modules/courses/courses.module';
import { GroupsModule } from './modules/groups/groups.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), JwtModule.register({
    global: true,
    signOptions: { expiresIn: "12h" },
    secret: "shaftoli"
  }), AuthModule, UsersModule, StudentsModule, TeachersModule, CoursesModule, GroupsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
