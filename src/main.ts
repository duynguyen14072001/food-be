// import { NestFactory, Reflector } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import {
//   ClassSerializerInterceptor,
//   UnprocessableEntityException,
//   ValidationPipe,
// } from '@nestjs/common';
// import { ResponseInterceptor } from './ResponseInterceptor';
// import { useContainer, ValidationError } from 'class-validator';
// import express from 'express';
// import { ExpressAdapter } from '@nestjs/platform-express';

// const server = express();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

//   // app.enableCors({
//   //   allowedHeaders: '*',
//   //   origin:
//   //     process.env.NODE_ENV === 'production'
//   //       ? [process.env.ORIGIN_URL_USER, process.env.ORIGIN_URL_ADMIN]
//   //       : '*',
//   //   credentials: true,
//   // });

//   app.setGlobalPrefix('api/v1');

//   app.useGlobalPipes(
//     new ValidationPipe({
//       transform: true,
//       transformOptions: {
//         enableImplicitConversion: true,
//       },
//       exceptionFactory: (validationErrors: ValidationError[] | any = []) => {
//         return new UnprocessableEntityException(
//           validationErrors.map((error) => {
//             if (error.children.length) {
//               const errorNested: any = [];
//               for (const i of validationErrors) {
//                 for (const j of i.children) {
//                   for (const k of j.children) {
//                     errorNested.push({
//                       field: i.property + '.' + j.property + '.' + k.property,
//                       error: Object.values(k.constraints),
//                     });
//                   }
//                 }
//               }
//               return errorNested;
//             }
//             return {
//               field: error.property,
//               error: Object.values(error.constraints),
//             };
//           }),
//         );
//       },
//     }),
//   );
//   app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
//   app.useGlobalInterceptors(new ResponseInterceptor());
//   useContainer(app.select(AppModule), { fallbackOnErrors: true });

//   if (process.env.NODE_ENV !== 'production') {
//     const config = new DocumentBuilder()
//       .setTitle('Food TLU Api')
//       .setDescription('Food TLU Api description')
//       .setVersion('1.0')
//       .addBearerAuth(
//         {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT',
//           name: 'JWT',
//           description: 'Enter JWT token',
//           in: 'header',
//         },
//         'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
//       )
//       .build();

//     const document = SwaggerModule.createDocument(app, config);
//     SwaggerModule.setup('api', app, document);
//   }

//   await app.listen(3003);
// }
// bootstrap();
// export default server;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
