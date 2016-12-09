import Poll from '../models/poll';
import cuid from 'cuid';
import slug from 'slug';
import sanitizeHtml from 'sanitize-html';

export function getPolls(req, res) {
  Poll.find().sort('-dateAdded').exec((err, polls) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ polls });
  });
}

export function addPoll(req, res) {
  if (!req.body.poll.name || !req.body.poll.title) {
    res.status(403).end();
  }

  const newPoll = new Poll(req.body.poll);

  // Let's sanitize inputs
  newPoll.title = sanitizeHtml(newPoll.title);
  newPoll.name = sanitizeHtml(newPoll.name);
  newPoll.options.forEach((obj) => {
    const rObj = {};
    rObj.option = sanitizeHtml(obj.option);
    rObj.votes = sanitizeHtml(obj.votes);
    return rObj;
  });

  newPoll.slug = slug(newPoll.title.toLowerCase(), { lowercase: true });
  newPoll.cuid = cuid();
  newPoll.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ poll: saved });
  });
}

export function getPoll(req, res) {
  const newSlug = req.query.slug.split('-');
  const newCuid = newSlug[newSlug.length - 1];
  Poll.findOne({ cuid: newCuid }).exec((err, poll) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ poll });
  });
}

export function deletePoll(req, res) {
  const pollId = req.body.pollId;
  Poll.findById(pollId).exec((err, poll) => {
    if (err) {
      res.status(500).send(err);
    }

    poll.remove(() =>
      res.status(200).end()
    );
  });
}

export function vote(req, res) {
  const pollId = req.body.pollId;
  const optionId = req.body.optionId;
  Poll.update(
    { _id: pollId, 'options._id': optionId },
    { $inc: { 'options.$.votes': 1 } })
    .exec((err) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).end();
    });
}