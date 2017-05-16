/**
 * Created by puman on 15.05.2017.
 */

export class AlphaBeta {

  public MAX_SCORE = Math.pow(10, 50);

  private maximizeLogic = {
    isPrune: function (score, parent) {
      return score >= parent.beta
    },
    isUpdate: function (score, parent) {
      return score > parent.alpha
    },
    doUpdate: function (score, parent) {
      parent.alpha = score
    },
    getElseScore: function (parent) {
      return parent.alpha
    }
  };

  private minimizeLogic = {
    isPrune: function (score, parent) {
      return score <= parent.alpha
    },
    isUpdate: function (score, parent) {
      return score < parent.beta
    },
    doUpdate: function (score, parent) {
      parent.beta = score
    },
    getElseScore: function (parent) {
      return parent.beta
    }
  };

  private scoreFunction:any = function (callback) {
    callback(0)
  };

  private generateMoves = function () {
    return []
  };

  private checkWinConditions: any= function () {
    return false
  };

  private uniqueKey = undefined;
  private keyList = {};
  private start = {};
  private depth = 1;
  private startAlpha = Number.NEGATIVE_INFINITY;
  private startBeta = Number.POSITIVE_INFINITY;
  private workQueue = [];
  private top: any = {};

  private valueOr(value, _default) {
    return value ? value : _default
  }

  private scoreModifier(stateDepth) {
    return ( stateDepth % 2 ) * 2 - 1  // odd levels are players state, even are opponent
  }


  private calculateTopLevel(workQueue) {
    return workQueue[0] ? Math.max(workQueue[0].depth - 1, 0) : 0
  }

  // remove all work from the queue that is greater than a given depth
  // return the top level in the workQueue
  private prune(depth, workQueue) {
    while (workQueue[0] && workQueue[0].depth > depth) {
      workQueue.shift()
    }
    return this.calculateTopLevel(workQueue)
  }

  private updateAllParentsAlphaBetaBasedOnScore(workItem, workQueue) {

    // update the previous minimax scores
    var topLevel = this.calculateTopLevel(workQueue)
    var score = workItem.score
    var parent = workItem.previous
    var best = workItem

    function updateParentAlphaBeta(score, parent) {
      var logic = parent.depth % 2 == 0 ? this.maximizeLogic : this.minimizeLogic;

      if (logic.isPrune(score, parent)) {
        topLevel = this.prune(parent.depth, workQueue)
      }
      if (logic.isUpdate(score, parent)) {
        logic.doUpdate(score, parent)
        parent.prediction = workItem
        parent.best = best
      } else {
        score = logic.getElseScore(parent)
        workItem = parent.prediction
      }
      return score
    }

    while (parent && parent.depth >= topLevel) {
      score = updateParentAlphaBeta(score, parent)
      best = parent
      parent = parent.previous
    }

  }

  // returns the number of items added to the workQueue
  private expandWorkItem(generateMoves, workItem, workQueue, uniqueKey, keyList) {

    if (workItem.previous) {
      workItem.alpha = workItem.previous.alpha
      workItem.beta = workItem.previous.beta
    }

    if (uniqueKey != undefined && keyList[uniqueKey(workItem.state)] == true) {
      return 0
    }
    if (uniqueKey) keyList[uniqueKey(workItem.state)] = true

    var stateList = generateMoves(workItem.state)
    for (var i = stateList.length - 1; i >= 0; i--) {
      var state = stateList[i]
      workQueue.unshift({
        state: state,
        depth: workItem.depth + 1,
        previous: workItem,
        alpha: workItem.alpha,
        beta: workItem.beta,
        prediction: workItem.prediction
      })
    }
    return stateList.length;

  }

  private setInitialization(initialization) {
    initialization = this.valueOr(initialization, {});
    this.scoreFunction = this.valueOr(initialization.scoreFunction, this.scoreFunction);
    this.generateMoves = this.valueOr(initialization.generateMoves, this.generateMoves);
    this.uniqueKey = this.valueOr(initialization.uniqueKey, this.uniqueKey);
    this.keyList = {};

    this.checkWinConditions = this.valueOr(initialization.checkWinConditions, this.checkWinConditions);
    this.start = this.valueOr(initialization.state, this.start);
    this.depth = this.valueOr(initialization.depth, this.depth);
    this.startAlpha = this.valueOr(initialization.alpha, this.startAlpha);
    this.startBeta = this.valueOr(initialization.beta, this.startBeta);

    this.workQueue = [{state: this.start, depth: 0, alpha: this.startAlpha, beta: this.startBeta}];
    this.top = this.workQueue[0]
  }

  private scoreWorkItem(workItem, callback) {
    this.scoreFunction(workItem.state, function (score) {
      workItem.score = score * this.scoreModifier(workItem.depth)
      this.workQueue.unshift(workItem)
      callback();
    })
  }

  constructor(initialization) {
    this.setInitialization(initialization);
    }

  //PUBLIC :

  public clone( initialization ) {
    return new AlphaBeta({
      initialization : initialization,
      scoreFunction : this.scoreFunction,
      generateMoves : this.generateMoves,
      checkWinConditions : this.checkWinConditions,
      uniqueKey : this.uniqueKey,
      state : this.start,
      depth : this.depth,
      startAlpha : this.startAlpha,
      startBeta : this.startBeta
    }).setup( initialization )
  };

  public setup(initialization) {
    this.setInitialization(initialization);
    return this
  };

  public prediction() {
    return this.top.prediction || {}
  };

  public best() {
    if (!this.top.prediction || !this.top.prediction.state) {
      return false
    }
    if (!this.top.best || !this.top.best.state) {
      return false
    }
    return this.top.best.state;
  };

  public alpha() {
    return this.top.alpha;
  };

  public step(callback) {
    var workItem = this.workQueue.shift();
    if (!workItem) {
      callback(this.best());
      return this
    }

    if (workItem.score != undefined) {

      this.updateAllParentsAlphaBetaBasedOnScore(workItem, this.workQueue)
      callback()
      return this

    } else if (workItem.depth > 0 && this.checkWinConditions(workItem.state)) {

      workItem.score = this.MAX_SCORE * this.scoreModifier(workItem.depth)
      this.workQueue.unshift(workItem)
      callback()
      return this

    } else if (workItem.depth < this.depth) {

      if (this.expandWorkItem(this.generateMoves, workItem, this.workQueue, this.uniqueKey, this.keyList) == 0) {
        this.scoreWorkItem(workItem, callback)
        return this
      } else {
        callback()
        return this
      }

    } else { // if ( workItem.depth >= depth ) {

      this.scoreWorkItem(workItem, callback)
      return this

    }
  };

  public _stepUntilTime(timeout, callback, count) {
    count = count ? count : 0
    var that = this
    return this.step(function (bestMove) {
      if (bestMove === undefined && timeout > (new Date()).getTime()) {
        if (count > 20) {
          setTimeout(function () {
            that._stepUntilTime(timeout, callback, 0)
          }, 1)
        } else {
          that._stepUntilTime(timeout, callback, count + 1)
        }
      } else {
        callback(bestMove)
      }
    })
  };

  public stepForMilliseconds(milliseconds, callback) {
    return this._stepUntilTime((new Date()).getTime() + milliseconds, callback, 0)
  };

  public incrementDepthForMilliseconds(milliseconds, callback, previous) {
    var that = this
    previous = previous ? previous : {
      alphabeta: this,
      depth: this.depth - 1
    }

    var endTime = (new Date()).getTime() + milliseconds

    // create a new
    var alphabeta = that.clone({depth: previous.depth + 1})

    return alphabeta._stepUntilTime(endTime, function (bestState) {
      var timeLeft = endTime - (new Date()).getTime()
      var result = {alphabeta: alphabeta, depth: previous.depth + 1}
      if (timeLeft > 0 && bestState != undefined) {
        setTimeout(function () {
          alphabeta.incrementDepthForMilliseconds(
            timeLeft, callback, result
          )
        }, 1)
      } else if (bestState != undefined) {
        return callback(result)
      } else {
        previous["incomplete"] = result
        return callback(previous)
      }
    },0)
  };

  public allSteps(callback) {
    return this._stepUntilTime(Number.POSITIVE_INFINITY, callback,0)
  }


}
