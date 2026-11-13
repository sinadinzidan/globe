# 00 · Meta: How Standards Are Written

## Conventions

- One topic per file, named `NN-topic.md`, numbered in order of addition.
- Every file starts with a one-line statement of what it covers.
- Rules are short, imperative and testable. Use **MUST**, **SHOULD** and **MAY** in the RFC 2119 sense.
- Give a reason for any rule that is not obvious.
- Show a correct example, and an incorrect one where it helps.
- Every new standard is added to the index in `README.md` with a status.

## Single source of truth

Rules live only in `docs/standards/`. Agent entry files link here and never duplicate content, so there is exactly one place to update.
