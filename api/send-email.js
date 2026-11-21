import { Resend } from 'resend';

const resend = new Resend('re_PeDSFbE9_EGtZzFUHbqAikrP39jJXzNso');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'xalmuratovmiyras37@gmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});