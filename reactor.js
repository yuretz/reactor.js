// Generated by CoffeeScript 1.6.2
(function() {
  var dependencyStack, global;

  global = typeof exports !== "undefined" && exports !== null ? exports : this;

  dependencyStack = [];

  global.Signal = function(definition) {
    var createdSignal, evaluate, value;

    value = null;
    evaluate = function(observerList) {
      var arrayMethods, dependency, dependentEvaluate, dependentIndex, methodName, observerTrigger, _fn, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _results;

      value = definition;
      arrayMethods = ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"];
      if (definition instanceof Array) {
        _fn = function(methodName) {
          return createdSignal[methodName] = function() {
            var output;

            output = definition[methodName].apply(definition, arguments);
            createdSignal(definition);
            return output;
          };
        };
        for (_i = 0, _len = arrayMethods.length; _i < _len; _i++) {
          methodName = arrayMethods[_i];
          _fn(methodName);
        }
      } else {
        for (_j = 0, _len1 = arrayMethods.length; _j < _len1; _j++) {
          methodName = arrayMethods[_j];
          delete createdSignal[methodName];
        }
      }
      if (definition instanceof Object) {
        createdSignal.set = function(key, value) {
          definition[key] = value;
          return createdSignal(definition);
        };
      } else {
        delete createdSignal.set;
      }
      if (typeof definition === "function") {
        _ref = evaluate.dependencies;
        for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
          dependency = _ref[_k];
          dependentIndex = dependency.dependents.indexOf(evaluate);
          dependency.dependents.splice(dependentIndex, 1);
        }
        evaluate.dependencies = [];
        dependencyStack.unshift(evaluate);
        value = definition();
        dependencyStack.shift();
      }
      _ref1 = evaluate.observers.slice(0);
      for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
        observerTrigger = _ref1[_l];
        if ((observerList.indexOf(observerTrigger)) < 0) {
          observerList.push(observerTrigger);
        }
      }
      evaluate.dependentTargets = evaluate.dependents.slice(0);
      _ref2 = evaluate.dependents.slice(0);
      _results = [];
      for (_m = 0, _len4 = _ref2.length; _m < _len4; _m++) {
        dependentEvaluate = _ref2[_m];
        if (evaluate.dependentTargets.indexOf(dependentEvaluate) >= 0) {
          _results.push(dependentEvaluate(observerList));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    evaluate.dependencies = [];
    evaluate.dependencyType = "signal";
    evaluate.dependents = [];
    evaluate.observers = [];
    evaluate.dependentTargets = [];
    createdSignal = function(newDefinition) {
      var dependent, existingDependencyIndex, existingDependentIndex, existingObserveeIndex, existingObserverIndex, observerList, observerTrigger, targetDependentIndex, _i, _len;

      if (newDefinition !== void 0) {
        definition = newDefinition;
        observerList = [];
        evaluate(observerList);
        for (_i = 0, _len = observerList.length; _i < _len; _i++) {
          observerTrigger = observerList[_i];
          observerTrigger();
        }
        return value;
      } else {
        dependent = dependencyStack[0];
        if ((dependent != null) && (dependent.dependencyType === "signal" || dependent.dependencyType === "event")) {
          targetDependentIndex = evaluate.dependentTargets.indexOf(dependent);
          if (targetDependentIndex >= 0) {
            evaluate.dependentTargets.splice(targetDependentIndex, 1);
          }
          existingDependentIndex = evaluate.dependents.indexOf(dependent);
          if (existingDependentIndex < 0) {
            evaluate.dependents.push(dependent);
          }
          existingDependencyIndex = dependent.dependencies.indexOf(evaluate);
          if (existingDependencyIndex < 0) {
            dependent.dependencies.push(evaluate);
          }
        } else if ((dependent != null) && dependent.dependencyType === "observer") {
          existingObserverIndex = evaluate.observers.indexOf(dependent);
          if (existingObserverIndex < 0) {
            evaluate.observers.push(dependent);
          }
          existingObserveeIndex = dependent.observees.indexOf(evaluate);
          if (existingObserveeIndex < 0) {
            dependent.observees.push(evaluate);
          }
        }
        return value;
      }
    };
    evaluate();
    return createdSignal;
  };

  global.Observer = function(response) {
    var createdObserver, trigger;

    trigger = function() {
      var observee, observerIndex, _i, _len, _ref;

      _ref = trigger.observees;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        observee = _ref[_i];
        observerIndex = observee.observers.indexOf(trigger);
        observee.observers.splice(observerIndex, 1);
      }
      trigger.observees = [];
      dependencyStack.unshift(trigger);
      if (response !== null) {
        response();
      }
      return dependencyStack.shift();
    };
    trigger.observees = [];
    trigger.dependencyType = "observer";
    createdObserver = function(newResponse) {
      response = newResponse;
      trigger();
      return null;
    };
    trigger();
    return createdObserver;
  };

  global.Event = function(definition) {
    var createdEvent, evaluate, value;

    value = null;
    evaluate = function(observerList) {
      var dependency, dependentEvaluate, dependentIndex, observerTrigger, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;

      value = definition;
      if (typeof definition === "function") {
        _ref = evaluate.dependencies;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          dependency = _ref[_i];
          dependentIndex = dependency.dependents.indexOf(evaluate);
          dependency.dependents.splice(dependentIndex, 1);
        }
        evaluate.dependencies = [];
        dependencyStack.unshift(evaluate);
        value = definition();
        dependencyStack.shift();
      }
      _ref1 = evaluate.observers.slice(0);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        observerTrigger = _ref1[_j];
        if ((observerList.indexOf(observerTrigger)) < 0) {
          observerList.push(observerTrigger);
        }
      }
      evaluate.dependentTargets = evaluate.dependents.slice(0);
      _ref2 = evaluate.dependents.slice(0);
      _results = [];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        dependentEvaluate = _ref2[_k];
        if (evaluate.dependentTargets.indexOf(dependentEvaluate) >= 0) {
          _results.push(dependentEvaluate(observerList));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    evaluate.dependencies = [];
    evaluate.dependencyType = "event";
    evaluate.dependents = [];
    evaluate.observers = [];
    evaluate.dependentTargets = [];
    createdEvent = function(newDefinition) {
      var dependent, existingDependencyIndex, existingDependentIndex, existingObserveeIndex, existingObserverIndex, observerList, observerTrigger, targetDependentIndex, _i, _len;

      if (newDefinition !== void 0) {
        definition = newDefinition;
        observerList = [];
        evaluate(observerList);
        for (_i = 0, _len = observerList.length; _i < _len; _i++) {
          observerTrigger = observerList[_i];
          observerTrigger();
        }
        value = null;
        return value;
      } else {
        dependent = dependencyStack[0];
        if ((dependent != null) && (dependent.dependencyType === "signal" || dependent.dependencyType === "event")) {
          targetDependentIndex = evaluate.dependentTargets.indexOf(dependent);
          if (targetDependentIndex >= 0) {
            evaluate.dependentTargets.splice(targetDependentIndex, 1);
          }
          existingDependentIndex = evaluate.dependents.indexOf(dependent);
          if (existingDependentIndex < 0) {
            evaluate.dependents.push(dependent);
          }
          existingDependencyIndex = dependent.dependencies.indexOf(evaluate);
          if (existingDependencyIndex < 0) {
            dependent.dependencies.push(evaluate);
          }
        } else if ((dependent != null) && dependent.dependencyType === "observer") {
          existingObserverIndex = evaluate.observers.indexOf(dependent);
          if (existingObserverIndex < 0) {
            evaluate.observers.push(dependent);
          }
          existingObserveeIndex = dependent.observees.indexOf(evaluate);
          if (existingObserveeIndex < 0) {
            dependent.observees.push(evaluate);
          }
        }
        return value;
      }
    };
    evaluate();
    value = null;
    return createdEvent;
  };

}).call(this);
