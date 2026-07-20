import { Conversation } from './conversation.entity';

describe('Conversation', () => {
  const newConvo = () =>
    Conversation.create('c1', { tourId: 't1', hostId: 'host', travelerId: 'trav' });

  it('starts with no lastMessageAt', () => {
    expect(newConvo().lastMessageAt).toBeNull();
  });

  it('recognises host and traveler as participants', () => {
    const convo = newConvo();
    expect(convo.isParticipant('host')).toBe(true);
    expect(convo.isParticipant('trav')).toBe(true);
    expect(convo.isParticipant('stranger')).toBe(false);
  });

  it('records the last message time', () => {
    const convo = newConvo();
    const at = new Date('2026-07-20T10:00:00.000Z');
    convo.registerMessage(at);
    expect(convo.lastMessageAt).toEqual(at);
  });
});
