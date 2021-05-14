const e = require("express");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const watch = mongoose.model("watchlist");
router.post("/watch", async (req, res) => {
    const data = req.body;
    try {
        watch.findOne({ userid: data.userid }).then(async (value) => {
            if (value) {
                await watch.updateMany({ userid: data.userid }, {
                    $push: {
                        watchlist: data.watchlist
                    }

                }).then((re) => res.json({ "message": "success" }));
            }
            else {
                const watchlist = await new watch(data);
                watchlist.save()
                res.json({ result: data })

            }
        })

    } catch (error) {
        res.json({ message: "some error occured" });
    }
})
router.get("/watch/:userid", async (req, res) => {
    const post = await watch.find({ userid: req.params.userid })
    const sortByDate = arr => {
        const sorter = (a, b) => {
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        }
        arr.sort(sorter);
    };
    res.json({ post: post });
})
router.put("/watch/:watchnameid", async (req, res) => {
    const watchlist = req.body.watchlist;
    try {
        await watch.findByIdAndUpdate(req.params.watchnameid, {
            $push: {
                watchlist: watchlist
            }
        }).then((result) => res.json({ post: result }));
    } catch (err) {
        res.json({ err: err.message });
    }
})
router.put("/watch/:watchnameid/:watchmovienameid", async (req, res) => {

    const watchlist = req.body.watchlistdata;
    try {
        await watch.updateMany(
            {
                "_id": req.params.watchnameid,
                "watchlist": {
                    "$elemMatch": {
                        "_id": req.params.watchmovienameid,
                    }

                }
            }, {
            $push: {
                "watchlist.$[outer].watchlistdata": watchlist
            },
        },
            { arrayFilters: [{ "outer._id": req.params.watchmovienameid }], multi: true }

        ).then((r) => {
            res.json({ message: "success" });
        });


    } catch (err) {
        res.json({ err: err.message });
    }
})
module.exports = router;