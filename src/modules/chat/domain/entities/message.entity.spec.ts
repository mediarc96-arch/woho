import { InvalidArgumentException } from '../../../../shared/domain/exceptions/domain.exception';
import { Message } from './message.entity';

describe('Message.create', () => {
  it('trims content', () => {
    const message = Message.create('m1', {
      conversationId: 'c1',
      senderId: 'u1',
      content: '  hello  ',
    });
    expect(message.content).toBe('hello');
  });

  it('rejects empty content', () => {
    expect(() =>
      Message.create('m1', { conversationId: 'c1', senderId: 'u1', content: '   ' }),
    ).toThrow(InvalidArgumentException);
  });
});
