import { describe, expect, it, vi } from 'vitest';
import { createUpdateGate } from './updateGate';

const nextTick = () => Promise.resolve();

describe('createUpdateGate', () => {
  it('applies right away when nothing is blocking', () => {
    const apply = vi.fn();
    createUpdateGate(apply).markReady();
    expect(apply).toHaveBeenCalledTimes(1);
  });

  it('does nothing until an update is ready', async () => {
    const apply = vi.fn();
    const release = createUpdateGate(apply).block();
    release();
    await nextTick();
    expect(apply).not.toHaveBeenCalled();
  });

  it('waits for the activity to finish', async () => {
    const apply = vi.fn();
    const gate = createUpdateGate(apply);
    const release = gate.block();
    gate.markReady();
    await nextTick();
    expect(apply).not.toHaveBeenCalled();

    release();
    await nextTick();
    expect(apply).toHaveBeenCalledTimes(1);
  });

  it('does not apply while moving straight from one activity to another', async () => {
    const apply = vi.fn();
    const gate = createUpdateGate(apply);
    const leaveDiscover = gate.block();
    gate.markReady();

    leaveDiscover();
    const leaveLesson = gate.block();
    await nextTick();
    expect(apply).not.toHaveBeenCalled();

    leaveLesson();
    await nextTick();
    expect(apply).toHaveBeenCalledTimes(1);
  });

  it('waits for every blocker and ignores a repeated release', async () => {
    const apply = vi.fn();
    const gate = createUpdateGate(apply);
    const first = gate.block();
    const second = gate.block();
    gate.markReady();

    first();
    first();
    await nextTick();
    expect(apply).not.toHaveBeenCalled();

    second();
    await nextTick();
    expect(apply).toHaveBeenCalledTimes(1);
  });

  it('applies only once', async () => {
    const apply = vi.fn();
    const gate = createUpdateGate(apply);
    gate.markReady();
    gate.markReady();
    gate.block()();
    await nextTick();
    expect(apply).toHaveBeenCalledTimes(1);
  });
});
