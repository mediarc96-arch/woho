import { InvalidArgumentException } from '../../../../shared/domain/exceptions/domain.exception';
import { Comment } from './comment.entity';

describe('Comment.create', () => {
  it('trims content', () => {
    const comment = Comment.create('c1', { postId: 'p1', authorId: 'u1', content: '  hi  ' });
    expect(comment.content).toBe('hi');
  });

  it('rejects empty content', () => {
    expect(() => Comment.create('c1', { postId: 'p1', authorId: 'u1', content: '   ' })).toThrow(
      InvalidArgumentException,
    );
  });

  it('identifies its author', () => {
    const comment = Comment.create('c1', { postId: 'p1', authorId: 'u1', content: 'hi' });
    expect(comment.isAuthor('u1')).toBe(true);
    expect(comment.isAuthor('u2')).toBe(false);
  });
});
